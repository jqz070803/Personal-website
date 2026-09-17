# -*- coding: utf-8 -*-
"""
一次性（幂等）地把"太阳 + 分层细节山峦"背景块写入同目录上一级的 v2-index.html。
- 若已存在 id="bgParallax" 块，先移除再重建（可重复运行）
- 山脊：少而分明的主峰 + 侧坡碎峰 + 8 阶高频细碎起伏
- 每层 3 条脊线（back / inner / front）叠压，山体有层次而不堆小峰
"""
import io
import os
import random
import re

HERE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(os.path.dirname(HERE), "v2-index.html")

W = 1440
PTS = 241

# 每层: (cls, data-px, viewBox高, [back, inner, front])
LAYERS = [
    ("far", 48, 520, [
        dict(seed=11,  top=95,  span=160, peaks=6, w_min=0.045, w_max=0.105, h_min=0.55, h_max=1.00,
             sub=15, sub_w_min=0.011, sub_w_max=0.034, sub_h_min=0.09, sub_h_max=0.38,
             fine_amt=0.14, fine_freq=11.0, floor=0.22),
        dict(seed=111, top=150, span=150, peaks=5, w_min=0.050, w_max=0.115, h_min=0.55, h_max=1.00,
             sub=12, sub_w_min=0.011, sub_w_max=0.032, sub_h_min=0.09, sub_h_max=0.34,
             fine_amt=0.135, fine_freq=12.0, floor=0.26),
        dict(seed=22,  top=215, span=150, peaks=5, w_min=0.050, w_max=0.115, h_min=0.52, h_max=0.96,
             sub=14, sub_w_min=0.011, sub_w_max=0.032, sub_h_min=0.09, sub_h_max=0.36,
             fine_amt=0.13, fine_freq=12.0, floor=0.24),
    ]),
    ("mid", 88, 440, [
        dict(seed=33,  top=85,  span=150, peaks=6, w_min=0.045, w_max=0.100, h_min=0.55, h_max=1.00,
             sub=15, sub_w_min=0.011, sub_w_max=0.034, sub_h_min=0.09, sub_h_max=0.38,
             fine_amt=0.14, fine_freq=11.0, floor=0.22),
        dict(seed=133, top=140, span=140, peaks=5, w_min=0.050, w_max=0.110, h_min=0.55, h_max=1.00,
             sub=12, sub_w_min=0.011, sub_w_max=0.032, sub_h_min=0.09, sub_h_max=0.34,
             fine_amt=0.135, fine_freq=12.0, floor=0.26),
        dict(seed=44,  top=195, span=140, peaks=5, w_min=0.050, w_max=0.110, h_min=0.52, h_max=0.95,
             sub=14, sub_w_min=0.011, sub_w_max=0.032, sub_h_min=0.09, sub_h_max=0.36,
             fine_amt=0.13, fine_freq=12.0, floor=0.24),
    ]),
    ("near", 152, 360, [
        dict(seed=55,  top=70,  span=135, peaks=5, w_min=0.048, w_max=0.108, h_min=0.55, h_max=1.00,
             sub=13, sub_w_min=0.011, sub_w_max=0.032, sub_h_min=0.09, sub_h_max=0.36,
             fine_amt=0.135, fine_freq=11.0, floor=0.22),
        dict(seed=155, top=115, span=125, peaks=5, w_min=0.052, w_max=0.115, h_min=0.55, h_max=1.00,
             sub=11, sub_w_min=0.011, sub_w_max=0.030, sub_h_min=0.09, sub_h_max=0.32,
             fine_amt=0.13, fine_freq=12.0, floor=0.26),
        dict(seed=66,  top=165, span=125, peaks=4, w_min=0.052, w_max=0.118, h_min=0.52, h_max=0.94,
             sub=13, sub_w_min=0.011, sub_w_max=0.030, sub_h_min=0.09, sub_h_max=0.34,
             fine_amt=0.125, fine_freq=12.0, floor=0.24),
    ]),
]

# 每层 4 个渐变：A=back脊, B=inner脊, C=front脊, Rim=日照金边
PALETTE = {
    "far":  ("#3d628a", "#2a4a6b", "#30527a", "#1f3d5e", "#203a58", "#162c44", "#ffd9a0"),
    "mid":  ("#26466b", "#183253", "#1d3a5c", "#122a45", "#12263e", "#0d1c30", "#ffcf8c"),
    "near": ("#15304e", "#0d2036", "#102741", "#0a1a2d", "#08182a", "#061220", "#ffc47a"),
}


def smoothstep(t):
    return t * t * (3.0 - 2.0 * t)


def value_noise(seed, pts, grid):
    rnd = random.Random(seed)
    vals = [rnd.uniform(0.0, 1.0) for _ in range(grid + 1)]
    out = []
    for i in range(pts):
        t = i / (pts - 1) * grid
        i0 = int(t)
        if i0 >= grid:
            i0, f = grid - 1, 1.0
        else:
            f = t - i0
        a, b = vals[i0], vals[i0 + 1]
        out.append(a + (b - a) * smoothstep(f))
    return out


def fine(seed, pts, octaves=8, base_freq=9.0, gain=0.55):
    tot = [0.0] * pts
    amp, freq, norm = 1.0, base_freq, 0.0
    for o in range(octaves):
        nz = value_noise(seed * 61 + o * 7, pts, max(2, int(round(freq))))
        for i in range(pts):
            tot[i] += (nz[i] - 0.5) * amp
        norm += amp
        amp *= gain
        freq *= 2.0
    return [t / norm for t in tot]


def profile(seed, pts, peaks=6, base=0.06,
            w_min=0.035, w_max=0.085, h_min=0.45, h_max=1.0,
            sub=0, sub_w_min=0.012, sub_w_max=0.038, sub_h_min=0.07, sub_h_max=0.26,
            fine_amt=0.16, fine_freq=7.0, floor=0.32):
    """
    两档峰：少量"宽而高"的主峰 + 若干"窄而低"的小峰点缀，
    再叠 8 阶高频噪声；谷底用 floor 抬起，避免均匀锯齿和直插到底的深V。
    """
    rnd = random.Random(seed)
    ks = [(rnd.uniform(-0.05, 1.05), rnd.uniform(w_min, w_max), rnd.uniform(h_min, h_max))
          for _ in range(peaks)]
    rnd2 = random.Random(seed * 977 + 13)
    subs = [(rnd2.uniform(-0.03, 1.03), rnd2.uniform(sub_w_min, sub_w_max),
             rnd2.uniform(sub_h_min, sub_h_max))
            for _ in range(sub)]
    fz = fine(seed, pts, base_freq=fine_freq, octaves=8)
    out = []
    for i in range(pts):
        x = i / (pts - 1)
        s = base
        for c, w, h in ks:
            d = (x - c) / w
            s += h * 2.718281828 ** (-d * d)
        for c, w, h in subs:
            d = (x - c) / w
            s += h * 2.718281828 ** (-d * d)
        s += fz[i] * fine_amt
        out.append(max(s, 0.0))
    lo, hi = min(out), max(out)
    span = (hi - lo) or 1.0
    return [floor + (1.0 - floor) * (v - lo) / span for v in out]


def ridge_paths(seed, H, top, span, **kw):
    prof = profile(seed, PTS, **kw)
    pts = [(i / (PTS - 1) * W, top + (1.0 - h) * span) for i, h in enumerate(prof)]
    line = "M" + " L".join("%.0f,%.1f" % (x, y) for x, y in pts)
    return line + " L%d,%d L0,%d Z" % (W, H, H), line


def grad(gid, c0, c1):
    return (
        '          <linearGradient id="%s" x1="0" y1="0" x2="0" y2="1">\n'
        '            <stop offset="0" stop-color="%s"/>\n'
        '            <stop offset="1" stop-color="%s"/>\n'
        '          </linearGradient>\n' % (gid, c0, c1)
    )


def layer_block(cls, px, vb, ridges):
    (ba, bb, ia, ib, fa, fb, rim) = PALETTE[cls]
    out = []
    out.append('    <div class="bg-parallax__layer bg-parallax__layer--%s" data-px="%d">\n' % (cls, px))
    out.append('      <svg viewBox="0 0 1440 %d" preserveAspectRatio="none">\n' % vb)
    out.append('        <defs>\n')
    out.append(grad("px%sA" % cls, ba, bb))
    out.append(grad("px%sB" % cls, ia, ib))
    out.append(grad("px%sC" % cls, fa, fb))
    out.append(
        '          <linearGradient id="px%sRim" x1="0" y1="0" x2="1" y2="0">\n'
        '            <stop offset="0" stop-color="%s" stop-opacity="0"/>\n'
        '            <stop offset="0.5" stop-color="%s" stop-opacity="0.12"/>\n'
        '            <stop offset="0.82" stop-color="%s" stop-opacity="0.46"/>\n'
        '            <stop offset="1" stop-color="%s" stop-opacity="0.72"/>\n'
        '          </linearGradient>\n' % ("px%sRim" % cls, rim, rim, rim, rim)
    )
    out.append('        </defs>\n')
    letters = ("A", "B", "C")
    lines = []
    for i, rd in enumerate(ridges):
        d, ln = ridge_paths(H=vb, **rd)
        out.append('        <path d="%s" fill="url(#px%s%s)"/>\n' % (d, cls, letters[i]))
        lines.append(ln)
    # 最前脊线的日照金边
    out.append('        <path d="%s" fill="none" stroke="url(#px%sRim)" stroke-width="1.5" stroke-linejoin="round"/>\n'
               % (lines[-1], cls))
    out.append('      </svg>\n')
    out.append('    </div>\n')
    return "".join(out)


def build_block():
    parts = [
        '  <!-- ============ 视差背景（首屏之后淡入）：太阳 + 分层细节山峦，随滚动产生景深 ============ -->\n',
        '  <div class="bg-parallax" id="bgParallax" aria-hidden="true">\n',
        '    <div class="bg-parallax__sky"></div>\n',
        '    <!-- 太阳：最远，位移最小 -->\n',
        '    <div class="bg-parallax__sun" data-px="16"></div>\n',
    ]
    for cls, px, vb, ridges in LAYERS:
        parts.append(layer_block(cls, px, vb, ridges))
    parts.append('  </div>\n\n')
    return "".join(parts)


html = io.open(HTML, encoding="utf-8").read()

# 幂等：先移除已有的 bgParallax 块（从起始注释到与之匹配的收尾 </div>）
start_re = re.compile(r"[ \t]*<!-- =+ 视差背景[^\n]*\n[ \t]*<div class=\"bg-parallax\" id=\"bgParallax\".*?\n  </div>\n(?:\n)?", re.S)
html2, n = start_re.subn("", html)
print("removed_existing =", n)

anchor = '  <main id="top">'
assert html2.count(anchor) == 1, "anchor not unique: %d" % html2.count(anchor)
block = build_block()
new_html = html2.replace(anchor, block + anchor, 1)

io.open(HTML, "w", encoding="utf-8", newline="\n").write(new_html)
print("bgParallax count =", new_html.count('id="bgParallax"'))
print("layer count      =", new_html.count("bg-parallax__layer--"))
print("total_len        =", len(new_html))
