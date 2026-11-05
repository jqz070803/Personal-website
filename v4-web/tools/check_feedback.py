#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
问题反馈链路自检 —— 判断「提交反馈」到底卡在哪一层。

用法（在仓库根目录）：
    python v4-web/tools/check_feedback.py           # 只读到「能不能连上」，不写数据
    python v4-web/tools/check_feedback.py --write   # 额外真实插入 1 条测试记录

它会按顺序检查 4 层，任何一层失败都会直接告诉你是哪一层：
    1. 配置    —— 从 v4-web/v4-script.js 读到 SUPABASE_URL / SUPABASE_KEY
    2. DNS     —— 域名是否还能解析（项目被删/暂停时最先在这里失败）
    3. HTTPS   —— 能否建立 TLS 连接并拿到 HTTP 响应
    4. 写入    —— （可选）真实 POST 一条，验证 RLS + 表结构

⚠️ 前端显示的「网络好像不太顺」只对应第 2/3 层失败；
   如果第 3 层能通、第 4 层返回 4xx，那是数据库/权限问题，不是网络。
"""

import argparse
import json
import re
import socket
import ssl
import sys
import urllib.error
import urllib.request
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT = Path(__file__).resolve().parents[1]  # v4-web/
SCRIPT = ROOT / "v4-script.js"
TABLE = "user_feedback"


def read_config():
    """从 v4-script.js 里提取端点和 key，保证自检和线上代码用的是同一份配置。"""
    text = SCRIPT.read_text(encoding="utf-8")
    url = re.search(r'var\s+SUPABASE_URL\s*=\s*"([^"]+)"', text)
    key = re.search(r'var\s+SUPABASE_KEY\s*=\s*"([^"]+)"', text)
    if not url or not key:
        raise SystemExit("[1/4] 配置  ❌ 在 v4-script.js 里找不到 SUPABASE_URL / SUPABASE_KEY")
    return url.group(1).rstrip("/"), key.group(1)


def step(n, total, name, ok, detail=""):
    mark = "✅" if ok else "❌"
    print(f"[{n}/{total}] {name:<6} {mark} {detail}")
    return ok


def check_dns(host):
    try:
        infos = socket.getaddrinfo(host, 443, proto=socket.IPPROTO_TCP)
        ips = sorted({i[4][0] for i in infos})
        return step(2, 4, "DNS", True, f"{host} → {', '.join(ips)}"), ""
    except socket.gaierror as e:
        return (
            step(
                2,
                4,
                "DNS",
                False,
                f"{host} 解析失败（{e.strerror or e}）",
            ),
            "域名在 DNS 上不存在。Supabase 项目很可能已被删除，或暂停后域名被回收——"
            "这不是网络问题，也不是数据库锁。",
        )


def request(url, key, method="GET", payload=None, timeout=20):
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    headers = {
        "apikey": key,
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if payload is not None:
        headers["Prefer"] = "return=minimal"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    ctx = ssl.create_default_context()
    return urllib.request.urlopen(req, timeout=timeout, context=ctx)


def check_http(base, key):
    url = f"{base}/rest/v1/{TABLE}?select=id&limit=1"
    try:
        with request(url, key) as r:
            body = r.read().decode("utf-8", "replace")[:200]
            return step(3, 4, "HTTPS", True, f"HTTP {r.status}，应答 {body}"), ""
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:200]
        # 4xx 说明服务器已经应答，链路是通的，只是权限/表结构有问题
        hint = ""
        if e.code in (401, 403):
            hint = "被 RLS 拒绝了：检查 supabase-setup.sql 是否已在该项目执行。"
        elif e.code == 404:
            hint = f"表 {TABLE} 不存在或 URL 里的项目 ref 不对：先跑 supabase-setup.sql。"
        elif e.code >= 500:
            hint = (
                f"Cloudflare 已应答，但源站没起来（HTTP {e.code}）。"
                "项目多半是 paused 或正在 recovery：去 Supabase Dashboard 点 Restore project，"
                "等状态回到 Active 后隔 1-3 分钟再跑一次。"
                f"原始响应：{body}"
            )
        else:
            hint = f"服务器已应答，问题在数据库/权限侧，不是网络。原始响应：{body}"

        reachable = e.code < 500
        return (
            step(
                3,
                4,
                "HTTPS",
                reachable,
                f"HTTP {e.code}（链路通）" if reachable else f"HTTP {e.code}（源站未就绪）",
            ),
            hint,
        )
    except Exception as e:  # noqa: BLE001 - 这里就是要兜住所有连接类异常
        return step(3, 4, "HTTPS", False, f"{type(e).__name__}: {e}"), (
            "连接没建立起来。可能是 TLS 被拦、代理配置错误，或域名刚恢复还没生效。"
        )


def check_write(base, key):
    payload = {
        "name": "自检脚本",
        "device": "电脑",
        "content": "check_feedback.py 自动写入的测试记录，可在 Supabase Table Editor 删除。",
    }
    try:
        with request(f"{base}/rest/v1/{TABLE}", key, method="POST", payload=payload) as r:
            return step(4, 4, "写入", True, f"HTTP {r.status}，一条测试记录已入库"), ""
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")[:300]
        return step(4, 4, "写入", False, f"HTTP {e.code}"), f"原始响应：{body}"
    except Exception as e:  # noqa: BLE001
        return step(4, 4, "写入", False, f"{type(e).__name__}: {e}"), ""


def main():
    ap = argparse.ArgumentParser(description="检查问题反馈的写入链路是否可用")
    ap.add_argument("--write", action="store_true", help="真实插入一条测试记录")
    args = ap.parse_args()

    base, key = read_config()
    host = re.sub(r"^https?://", "", base).split("/")[0]
    step(1, 4, "配置", True, f"{base}（表 {TABLE}）")

    ok, hint = check_dns(host)
    if not ok:
        print(f"\n结论：{hint}")
        return 1

    ok, hint = check_http(base, key)
    if hint:
        print(f"\n提示：{hint}")

    if args.write and ok:
        wok, whist = check_write(base, key)
        if not wok and whist:
            print(f"\n提示：{whist}")
        if wok:
            print("\n结论：✅ 反馈链路完整可用。别忘了去 Table Editor 删掉那条测试记录。")
            return 0
        print("\n结论：❌ 能读不能写——访客点提交仍然会失败，按上面的提示修。")
        return 1

    if ok:
        print("\n结论：✅ 端点可达。加 --write 可以再验证一次真实写入。")
        return 0
    return 1


if __name__ == "__main__":
    sys.exit(main())
