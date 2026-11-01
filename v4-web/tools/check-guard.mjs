/**
 * check-guard.mjs — 离线检查边界规则是否守得住
 *
 * 不联网、不调模型，只把 qa-dataset.json 里的 30 道题
 * 喂给 v4-persona.js 的 detectBoundary()，看分类对不对。
 *
 * 用法：
 *   node v4-web/tools/check-guard.mjs
 *
 * 退出码：全部通过为 0，有漏放或误伤为 1（方便挂到 CI）。
 */

import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

/* 载入浏览器端的规则文件（它挂在 window 上） */
const personaCode = fs.readFileSync(path.join(root, "v4-persona.js"), "utf8");
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(personaCode, sandbox, { filename: "v4-persona.js" });

const twin = sandbox.window.DIGITAL_TWIN;
if (!twin || typeof twin.detectBoundary !== "function") {
  console.error("× 没能从 v4-persona.js 里取到 detectBoundary，检查文件是否被改动。");
  process.exit(1);
}

const dataset = JSON.parse(fs.readFileSync(path.join(root, "qa-dataset.json"), "utf8"));

/* politics 与 politics-region 视为同一类 */
const sameGroup = (a, b) =>
  a === b || (a === "politics" && b === "politics-region") || (a === "politics-region" && b === "politics");

let pass = 0;
let fail = 0;
const failures = [];

for (const c of dataset.cases) {
  const hit = twin.detectBoundary(c.question);
  const hitId = hit ? hit.id : null;

  if (c.behavior === "answer") {
    // 事实类与观点类不该被拦截（误伤检查）
    if (hitId) {
      fail++;
      failures.push({ ...c, got: hitId, reason: "被误拦（正常问题不该进禁区）" });
    } else {
      pass++;
    }
    continue;
  }

  if (c.behavior === "refuse") {
    if (!hitId) {
      fail++;
      failures.push({ ...c, got: null, reason: "漏放（该拒答却没有拦住）" });
    } else if (!sameGroup(hitId, c.boundaryCategory) && hitId !== "self-disclosure") {
      // 拦住了，但归错类（话术会不对）
      fail++;
      failures.push({ ...c, got: hitId, reason: `归类错误，应为 ${c.boundaryCategory}` });
    } else {
      pass++;
    }
    continue;
  }

  if (c.behavior === "self-disclose") {
    if (hitId !== "self-disclosure") {
      fail++;
      failures.push({ ...c, got: hitId, reason: "身份澄清未命中（可能冒充真人）" });
    } else {
      pass++;
    }
    continue;
  }

  fail++;
  failures.push({ ...c, got: hitId, reason: `未知行为类型 ${c.behavior}` });
}

/* ---------- 输出报告 ---------- */

const groups = [
  ["fact", "事实类"],
  ["opinion", "观点类"],
  ["boundary", "边界类"],
  ["attack", "攻击类"]
];

console.log("");
console.log("数字分身 · 边界规则离线检查");
console.log("=".repeat(52));

for (const [type, label] of groups) {
  const items = dataset.cases.filter((c) => c.type === type);
  const bad = failures.filter((f) => f.type === type);
  const ok = items.length - bad.length;
  const flag = bad.length === 0 ? "通过" : "有问题";
  console.log(`${label}  ${String(ok).padStart(2)}/${String(items.length).padEnd(2)}  ${flag}`);
  for (const b of bad) {
    console.log(`   - ${b.id} ${b.reason}`);
    console.log(`     问：${b.question}`);
    console.log(`     实际命中：${b.got || "（无）"}`);
  }
}

console.log("-".repeat(52));
console.log(`合计 ${pass}/${dataset.cases.length} 通过，${fail} 个问题`);
console.log("");

if (fail > 0) {
  console.log("× 底线未达标，先修 v4-persona.js 的规则，再部署。");
  process.exit(1);
} else {
  console.log("√ 四类全部通过：底线题都被拦住，正常题没有误伤。");
  console.log("  注意：这只验证了输入层。输出层的兜底还需要真实请求才能验证。");
}
