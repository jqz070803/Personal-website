# -*- coding: utf-8 -*-
"""
check_guard.py — 离线检查边界规则是否守得住（本机无 Node 时用这个）

不联网、不调模型。直接从 v4-persona.js / worker/worker.js 里
提取正则字面量，再拿 qa-dataset.json 的 30 道题跑一遍。

因为是从源文件提取而不是手抄，所以规则改了两份文件会一起被验证；
下面的「一致性检查」还会比对两份文件的规则是否等价。

用法：
  python v4-web/tools/check_guard.py
退出码：全部通过 0，有漏放/误伤 1
"""

import json
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)


def read(p):
    with open(p, "r", encoding="utf-8") as f:
        return f.read()


# ---------- 从 JS 源文件提取规则 ----------

PAT_LITERAL = re.compile(r"/((?:\\.|[^/\\])+)/([a-z]*)")


def strip_line_comments(text):
    """去掉 // 行注释，否则注释会被 PAT_LITERAL 当成正则字面量"""
    return re.sub(r"^\s*//.*$", "", text, flags=re.M)


def extract_rules(src, anchor, kind="rules"):
    """anchor 是 'var RULES = [' 或 'const RULES = ['"""
    start = src.index(anchor)
    end = src.index("\n];", start) if "\n];" in src[start:] else src.index("];", start)
    block = strip_line_comments(src[start:end])

    parts = re.split(r'\{\s*\n\s*id:\s*"([^"]+)"', block)
    out = []
    for i in range(1, len(parts), 2):
        rid = parts[i]
        body = parts[i + 1]
        pats = []
        for m in PAT_LITERAL.finditer(body):
            flags = 0
            if "i" in m.group(2):
                flags |= re.IGNORECASE
            try:
                pats.append((re.compile(m.group(1), flags), m.group(1)))
            except re.error as e:
                print(f"! 正则无法转换 [{rid}]: {m.group(1)} -> {e}")
        out.append({"id": rid, "patterns": pats})
    return out


def extract_single(src, anchor):
    start = src.index(anchor)
    m = re.search(r"\n\s*\};", src[start:])
    end = start + m.end() if m else len(src)
    block = strip_line_comments(src[start:end])
    pats = []
    for m2 in PAT_LITERAL.finditer(block):
        flags = re.IGNORECASE if "i" in m2.group(2) else 0
        pats.append((re.compile(m2.group(1), flags), m2.group(1)))
    return pats


persona = read(os.path.join(ROOT, "v4-persona.js"))
worker = read(os.path.join(ROOT, "worker", "worker.js"))
server_path = os.path.join(ROOT, "server", "index.js")
server = read(server_path) if os.path.exists(server_path) else None

p_rules = extract_rules(persona, "var RULES = [")
p_disclose = extract_single(persona, "var SELF_DISCLOSURE = ")

# 所有后端都要和前端保持一致；有几个就比几个
BACKENDS = [("worker.js", worker)]
if server:
    BACKENDS.append(("server/index.js", server))


# ---------- 一致性检查：前后端规则必须等价 ----------

def normalize(rules):
    return {r["id"]: tuple(sorted(p for _, p in r["patterns"])) for r in rules}


pn = normalize(p_rules)
pd = tuple(sorted(p for _, p in p_disclose))

inconsistent = []

for label, src in BACKENDS:
    bn = normalize(extract_rules(src, "const RULES = ["))
    if set(pn) != set(bn):
        inconsistent.append(f"{label} 的规则类别与前端不一致：前端 {sorted(pn)} / 后端 {sorted(bn)}")
    for k in set(pn) & set(bn):
        if pn[k] != bn[k]:
            inconsistent.append(f"「{k}」的正则 {label} 与前端不同")

    bd = tuple(sorted(p for _, p in extract_single(src, "const DISCLOSURE = ")))
    if bd != pd:
        inconsistent.append(f"{label} 的身份澄清规则与前端不同")

# 输出层只在后端之间比对（它和输入层本来就不同）
if server:
    w_out = normalize(extract_rules(worker, "const OUTPUT_GUARDS = ["))
    s_out = normalize(extract_rules(server, "const OUTPUT_GUARDS = ["))
    if w_out != s_out:
        inconsistent.append("输出层规则 worker.js 与 server/index.js 不一致")

# 话术是否一致
def replies_of(src):
    return re.findall(r'reply:\s*\n?\s*"([^"]+)"', src)


def reply_map(src):
    return {k: v for k, v in re.findall(r'^\s{2}(\w+):\s*\n?\s*"([^"]+)"', src, re.M)}


pr = replies_of(persona)

for label, src in BACKENDS:
    m = reply_map(src)
    for key in ("family", "politics", "others", "jailbreak", "disclose", "detail"):
        if key in m and m[key] not in pr:
            inconsistent.append(f"话术「{key}」在 {label} 里找不到对应文案")


# ---------- 判定 ----------

def detect(question, rules, disclose_pats):
    for p, _ in disclose_pats:
        if p.search(question):
            return "self-disclosure"
    # 越狱优先，与 v4-persona.js / worker.js 的判定顺序保持一致
    ordered = [r for r in rules if r["id"] == "jailbreak"] + [r for r in rules if r["id"] != "jailbreak"]
    for r in ordered:
        for p, _ in r["patterns"]:
            if p.search(question):
                return r["id"]
    return None


def same_group(a, b):
    if a == b:
        return True
    return {a, b} == {"politics", "politics-region"}


dataset = json.loads(read(os.path.join(ROOT, "qa-dataset.json")))
cases = dataset["cases"]

LABEL = {"fact": "事实类", "opinion": "观点类", "boundary": "边界类", "attack": "攻击类"}

passed, failed = 0, []
for c in cases:
    got = detect(c["question"], p_rules, p_disclose)
    beh = c["behavior"]

    if beh == "answer":
        if got:
            failed.append((c, got, "被误拦（正常问题不该进禁区）"))
        else:
            passed += 1
    elif beh == "refuse":
        if not got:
            failed.append((c, got, "漏放（该拒答却没有拦住）"))
        elif not same_group(got, c["boundaryCategory"]) and got != "self-disclosure":
            failed.append((c, got, f"归类错误，应为 {c['boundaryCategory']}"))
        else:
            passed += 1
    elif beh == "self-disclose":
        if got != "self-disclosure":
            failed.append((c, got, "身份澄清未命中（可能冒充真人）"))
        else:
            passed += 1
    else:
        failed.append((c, got, f"未知行为类型 {beh}"))


# ---------- 报告 ----------

print()
print("数字分身 · 边界规则离线检查")
print("=" * 56)

for t in ("fact", "opinion", "boundary", "attack"):
    total = sum(1 for c in cases if c["type"] == t)
    bad = [f for f in failed if f[0]["type"] == t]
    ok = total - len(bad)
    print(f"{LABEL[t]}  {ok:>2}/{total:<2}  {'通过' if not bad else '有问题'}")
    for c, got, reason in bad:
        print(f"   - {c['id']} {reason}")
        print(f"     问：{c['question']}")
        print(f"     实际命中：{got or '（无）'}")

print("-" * 56)

if inconsistent:
    print("规则同步状态：")
    for msg in inconsistent:
        print(f"   ! {msg}")
else:
    names = " 与 ".join(l for l, _ in BACKENDS)
    print(f"规则同步状态：前端与 {names} 一致")

print("-" * 56)
print(f"合计 {passed}/{len(cases)} 通过，{len(failed)} 个问题")
print()

if failed or inconsistent:
    print("× 底线未达标，先修规则再部署。")
    sys.exit(1)
else:
    print("√ 四类全部通过：底线题都被拦住，正常题没有误伤。")
    print("  注意：这只验证输入层，输出层的兜底需要真实请求才能验证。")
