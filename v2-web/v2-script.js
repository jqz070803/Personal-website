/* =========================================================
   v2-script.js — 江沁钊个人主页交互（v2：新增学业板块 + 视差山峦背景，交互沿用 v1）
   ========================================================= */

(function () {
  "use strict";

  /* ---------- 截图 / 预览模式（?shot=1）----------
     URL 带 shot=1 时：跳过滚动显现动画、让数字直接显示最终值，
     便于无头截图与打印抓取完整内容。 */
  var isShot = /[?&]shot=1/.test(window.location.search);
  if (isShot) {
    document.documentElement.classList.add("shot");
  }

  /* ---------- 导航栏滚动状态 ---------- */
  var nav = document.getElementById("nav");
  function onScrollNav() {
    if (window.scrollY > 20) {
      nav.classList.add("nav--scrolled");
    } else {
      nav.classList.remove("nav--scrolled");
    }
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- 滚动场景 / 背景色渐变 ----------
     在几个深空色带之间，随滚动位置缓慢切换 body 的 scene 档位，
     让背景颜色随鼠标下滑自然流动，而不是生硬跳变。 */
  var docEl = document.body;
  var sceneKeys = ["is-scene-2", "is-scene-3", "is-scene-4", "is-scene-5", "is-scene-6"];
  window.addEventListener(
    "scroll",
    function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var p = Math.min(window.scrollY / scrollable, 1); // 0..1
      // 用非线性缓动，让背景前半段变化更细腻、后半段逐步沉静
      var eased = p * (2 - p);
      var idx = Math.min(Math.floor(eased * sceneKeys.length), sceneKeys.length - 1);
      sceneKeys.forEach(function (k) {
        docEl.classList.toggle(k, false);
      });
      if (idx > 0) {
        docEl.classList.add(sceneKeys[idx - 1]);
      }
    },
    { passive: true }
  );

  /* ---------- 移动端汉堡菜单 ---------- */
  var burger = document.getElementById("navBurger");
  var menu = document.getElementById("navMenu");
  function toggleMenu(open) {
    var isOpen = typeof open === "boolean" ? open : !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", isOpen);
    burger.classList.toggle("is-open", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
  burger.addEventListener("click", function () {
    toggleMenu();
  });
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      toggleMenu(false);
    });
  });

  /* ---------- 滚动显现动效 ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 数字滚动统计 ---------- */
  var counters = document.querySelectorAll("[data-count]");
  function animateCount(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1500;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = progress * (2 - progress); // ease-out
      var val = Math.round(eased * target);
      el.textContent = val + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }
  if ("IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach(function (el) {
      countObserver.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      el.textContent = (parseInt(el.getAttribute("data-count"), 10) || 0) + "";
    });
  }

  /* ---------- 社交卡片 ----------
     B站 为真实链接，直接放行跳转；
     抖音 / 视频号 的主页链接尚未就绪，已在 HTML 里做成不可点的卡片
     （不带 href 的 div + 「筹备中」标注），因此这里不再需要占位弹窗拦截。 */

  /* ---------- 标题上浮渐显动效（[data-write]）----------
     把标题文字拆成单个字符（保留空格与标点），
     · hero 大标题：页面加载时按时间逐字上浮渐显；
     · 各区块标题：随滚动进入视口时按滚动进度逐字上浮渐显。
     截图模式（?shot=1）与减少动效偏好下直接整段显示。 */
  var writeEls = document.querySelectorAll("[data-write]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var writeItems = [];

  function splitText(el) {
    // 取文本（含空格），逐字符包一层 span，空白保留原样
    // 取文本（先归一空白再拆字）：
    // HTML 里多行书写的标题会带上换行 + 缩进空格，若原样拆成 span，
    // 每个空白会变成一个含 &nbsp; 的实宽 inline-block（不参与空白折叠），
    // 被 text-align:center 一起居中 -> 整行文字被推偏、甚至挤到第二行。
    // 这里统一压成单个空格并去掉首尾空白。
    var text = (el.textContent || "").replace(/\s+/g, " ").trim();
    var frag = document.createDocumentFragment();
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (/\s/.test(ch)) {
        var ws = document.createElement("span");
        ws.className = "write-char write-char--space";
        ws.innerHTML = "&nbsp;";
        frag.appendChild(ws);
      } else {
        var s = document.createElement("span");
        s.className = "write-char";
        s.textContent = ch;
        frag.appendChild(s);
      }
    }
    el.textContent = "";
    el.appendChild(frag);
    return el.querySelectorAll(".write-char:not(.write-char--space)");
  }

  if (writeEls.length) {
    writeEls.forEach(function (el) {
      var chars = splitText(el);
      writeItems.push({ el: el, chars: chars, written: 0, done: false });
    });

    function revealCount(item, count) {
      count = Math.max(0, Math.min(item.chars.length, Math.round(count)));
      for (var i = item.written; i < count; i++) {
        var c = item.chars[i];
        if (c && !c.classList.contains("on")) c.classList.add("on");
      }
      item.written = Math.max(item.written, count);
      if (count >= item.chars.length) item.done = true;
    }

    function writeAll(item) {
      revealCount(item, item.chars.length);
    }

    // 截图 / 减少动效：全部直接写出
    if (isShot || reduceMotion) {
      writeItems.forEach(writeAll);
    } else {
      function applyScrollWrite() {
        var vh = window.innerHeight;
        writeItems.forEach(function (item) {
          if (item.done) return;
          if (item.el.classList.contains("hero__title")) return; // hero 走时间轴
          var rect = item.el.getBoundingClientRect();
          // 溢出视口顶部(已滚过) -> 全部写出
          if (rect.top <= vh * 0.3) {
            writeAll(item);
            return;
          }
          // 底部进入视口 -> 开始写
          if (rect.top > vh) {
            revealCount(item, 0);
            return;
          }
          // 在该区间内按滚动进度写出
          var p = (vh - rect.top) / (vh - vh * 0.3); // 0..1
          p = Math.max(0, Math.min(1, p));
          revealCount(item, p * item.chars.length);
        });
      }

      // hero 时间轴书写：从底部逐一上浮渐显
      var heroItem = writeItems.filter(function (it) {
        return it.el.classList.contains("hero__title");
      })[0];
      if (heroItem && heroItem.chars.length) {
        var start = null;
        var dur = 1600;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3); // ease-out
          revealCount(heroItem, eased * heroItem.chars.length);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }

      window.addEventListener("scroll", applyScrollWrite, { passive: true });
      window.addEventListener("resize", applyScrollWrite, { passive: true });
      applyScrollWrite();
    }
  }

  /* ---------- About 简介屏：手写单词"about me"（真字体字形 + 数据自带笔顺书写）----------
     v1 是"描摹一条折线路径"（段间切线不连续 → 放大见棱角）；第二版改成"整词水平
     扫描遮罩"，边缘平滑了，但观感是"从左向右被填充"，不像在写字；第三版在**墨迹内部**
     算测地距离，想按笔顺推进，结果用户仍反馈"偏横向填充"——原因：笔画宽约 30px，
     等距前沿在笔画内部是一条**竖线**整体右移，粗笔画上又退化成了横扫。
      第四～六版试图让算法自己"猜"笔顺（骨架测地距离 / 贪心走笔 / 回溯式深度优先走笔），
      都不对。用户点破了关键：**最初那版（还没有彩虹的时候）笔顺是对的** ——
      因为那版用的是 v2-about-data.js 里 9 条手工排好顺序的笔画轨迹（真人书写顺序：
      "a+b 连笔 → o → u → t 竖 → t 横 → m 三竖 → e"），不是猜出来的。
      第七版又把"算法猜出来的骨架时间"用 Dijkstra 铺满整片墨迹，反而更糟：实测整个
      "about"（x 32..468）被并进了第一笔的时间窗 —— 因为轨迹弧长比水平距离长得多
      （笔1 绕圈+升部弧长 892px 却只横跨 179px），"空间上多久能走到"压根不是笔序。
      所以本版彻底删掉骨架/走笔/测地距离这一整套，把"笔顺"完全交还给那份数据：
        ① 把字形画到画布、取 alpha 得到墨迹蒙版（顺带记下墨迹包围盒：轨迹对位要用它）；
        ② （已删除）Zhang-Suen 细化 + 剪毛刺 + 各种走笔/距离场；
        ③ 读取 ABOUT_STROKES.strokeD（9 笔画），用隐藏 SVG 的 getTotalLength/getPointAtLength
           采样成有序点 + 累积弧长，再线性映射到本画布的墨迹包围盒上；笔与笔之间补一段固定的
           "提笔空隙"弧长。这就是**笔顺的唯一来源**，与数据里的书写顺序完全一致；
        ④ 每个墨迹像素的书写时间 = 轨迹上离它最近的那一点的弧长（16px 网格 + 逐圈外扩加速）。
           语义就是"笔尖扫到哪儿、哪儿的墨就出现"：笔序单调，不会让早笔串染晚笔的墨；
        ⑤ 归一化：时刻 = 弧长 / 轨迹总弧长（0..1），与笔尖共用同一把尺 ⇒ 笔尖到哪儿、
           哪儿的墨正好显完；提笔空隙那段弧长没有墨迹对应，动画里自然成了"抬笔挪位置"的停顿。
      彩虹按列取样（左绿 → 右蓝）；笔尖沿轨迹点走，提笔空隙处藏起来。
     评审开关：URL 加 ?replay=1 循环重播、?dur=4000 放慢单次时长（毫秒）；点一下单词也能重播。
     截图 / 减少动效：直接显示完整墨迹 + 隐藏笔尖。
     触发判据与 03 足迹拼图同源：单词顶边越过视口 60% 才开演（不早播）。 */
  (function () {
    var canvas = document.getElementById("wordCanvas");
    var penEl = document.getElementById("wordPen");
    var wordEl = document.getElementById("aboutScreenWord");
    if (!canvas || !penEl || !wordEl) return;
    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var TEXT = "about me";
    var RATIO = 1000 / 260;   // 画布宽高比（与旧 SVG 的 viewBox 相同 → 版面高度不变）
    var FIT = 0.93;           // 目标字宽 / 画布宽（左右留一点余量给起收笔）
    var TRIGGER = 0.6;        // 顶边越过视口 60% 才开演
    var DUR = 2000;
    // 彩虹七档（与上一版 linearGradient 的 stop 完全一致）
    var STOPS = [[0, 95, 211, 95], [0.17, 184, 227, 74], [0.34, 255, 210, 63],
                 [0.5, 255, 155, 66], [0.66, 255, 95, 158], [0.83, 176, 107, 255],
                 [1, 74, 168, 255]];

    // 评审开关（都不影响默认观感）：?replay=1 → 循环重播；?dur=4000 → 单次时长（毫秒，600..20000）。
    // 另外：点一下单词本身也能重播一遍。
    var LOOP = /[?&]replay=1/.test(location.search);
    var mDur = /[?&]dur=(\d+)/.exec(location.search);
    if (mDur) DUR = clamp(parseInt(mDur[1], 10), 600, 20000);

    var W = 0, H = 0, dpr = 1;
    var imgData = null, inkOff = null, inkA = null, inkT = null;
    var colR = null, colG = null, colB = null;
    var trkX = null, trkY = null, trkS = null, trkPen = null, trkN = 0, trkL = 1;  // 书写轨迹（笔顺 + 笔尖定位）
    var ready = false, started = false, playing = false, drawn = -1;
    var penOn = false, penInit = false, penX = 0, penY = 0, penAng = -18;
    var resizeTimer = 0;

    function clamp(v, a, b) { return v < a ? a : (v > b ? b : v); }

    // 逐列彩虹取样（横向铺满，左绿 → 右蓝）
    function buildRainbow(w) {
      colR = new Uint8Array(w); colG = new Uint8Array(w); colB = new Uint8Array(w);
      for (var x = 0; x < w; x++) {
        var u = w > 1 ? x / (w - 1) : 0, i = 0;
        while (i < STOPS.length - 2 && u > STOPS[i + 1][0]) i++;
        var a = STOPS[i], b = STOPS[i + 1];
        var k = clamp((u - a[0]) / ((b[0] - a[0]) || 1), 0, 1);
        colR[x] = Math.round(a[1] + (b[1] - a[1]) * k);
        colG[x] = Math.round(a[2] + (b[2] - a[2]) * k);
        colB[x] = Math.round(a[3] + (b[3] - a[3]) * k);
      }
    }

    /* ---- 一次性构建：量字 → 绘制 → 墨迹蒙版 + 包围盒 → 笔迹轨迹 → 揭示时刻表 ---- */
    function build() {
      var cssW = wordEl.clientWidth;
      if (!cssW) return;
      ready = false;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(8, Math.round(cssW * dpr));
      H = Math.max(4, Math.round(W / RATIO));
      canvas.width = W;
      canvas.height = H;
      canvas.style.height = (H / dpr) + "px";

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // 量字：迭代两次，让墨迹宽 ≈ FIT × 画布宽
      // （actualBoundingBox 只含墨迹，不含 em 盒的升降部留白，比 getBBox 准）
      var fs = 150, m = null, pass;
      for (pass = 0; pass < 2; pass++) {
        ctx.font = "400 " + fs + "px Pacifico, cursive";
        m = ctx.measureText(TEXT);
        var iw = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
        if (!iw) iw = m.width || 1;
        fs = clamp(fs * (FIT * W) / iw, 10, 900);
      }
      ctx.font = "400 " + fs + "px Pacifico, cursive";
      m = ctx.measureText(TEXT);

      // 居中绘制：纵向按墨迹的升/降部居中（避开 em 盒留白造成的偏移）
      var asc = m.actualBoundingBoxAscent || 0;
      var desc = m.actualBoundingBoxDescent || 0;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = "#fff";
      ctx.fillText(TEXT, W / 2, (H - (asc + desc)) / 2 + asc);

      imgData = ctx.getImageData(0, 0, W, H);
      var d = imgData.data, N = W * H, p, o;

      // 墨迹蒙版（alpha > 8；抗锯齿边缘一并算作墨迹，避免出现毛边）+ 墨迹包围盒
      var mask = new Uint8Array(N), inkN = 0;
      var bx0 = W, bx1 = -1, by0 = H, by1 = -1, mx, my;
      for (p = 0, o = 3; p < N; p++, o += 4) {
        if (d[o] > 8) {
          mask[p] = 1; inkN++;
          mx = p % W; my = (p - mx) / W;
          if (mx < bx0) bx0 = mx;
          if (mx > bx1) bx1 = mx;
          if (my < by0) by0 = my;
          if (my > by1) by1 = my;
        }
      }
      if (!inkN) return;

      // ② 骨架 / 走笔 / 测地距离场：全部删掉了。
      //    历史：细化出 1px 骨架 → 在骨架上用"深度优先走笔"或"测地距离"猜笔顺（失败 7 次）。
      //    失败根因有两层：
      //      a) 骨架拓扑并不能确定笔顺（a/b/o 的圈细化后是闭环、没有端点，谁先谁后无从判定）；
      //      b) 就算骨架时间是对的，再"沿墨迹累加像素距离"也会坏 —— 粗笔画上空间相邻的两处
      //         笔序可以差很多，早笔的距离场会把晚笔的墨提前染上色。实测整个 "about"
      //         （x 32..468）都被并进了第一笔的时间窗，看画面又成了"一大片一起亮"。
      //    现在笔顺 100% 来自 ③ 的书写轨迹数据，墨迹上色只是"取最近的那个轨迹点"。

      // ③ 笔顺序列：不再让算法"猜"笔顺，直接用最初那版手工排好顺序的书写轨迹数据
      //    （v2-about-data.js 的 window.ABOUT_STROKES.strokeD：9 条按真人书写顺序一笔一笔
      //     描下来的 path）。用隐藏 SVG 的 getPointAtLength 采样成有序点 + 累积弧长，
      //    再线性映射到本画布的墨迹包围盒上。笔与笔之间补一段固定"提笔空隙"弧长。
      trkX = []; trkY = []; trkS = []; trkPen = []; trkN = 0; trkL = 1;
      (function () {
        var SD = (window.ABOUT_STROKES && window.ABOUT_STROKES.strokeD) || null;
        if (!SD || !SD.length) return;
        var NS = "http://www.w3.org/2000/svg";
        var sv = document.createElementNS(NS, "svg");
        sv.setAttribute("width", 0); sv.setAttribute("height", 0);
        sv.style.cssText = "position:absolute;left:-99999px;top:0;width:0;height:0;overflow:hidden";
        document.body.appendChild(sv);
        var segs = [], rx0 = 1e18, rx1 = -1e18, ry0 = 1e18, ry1 = -1e18;
        for (var sg = 0; sg < SD.length; sg++) {
          var pe = document.createElementNS(NS, "path");
          pe.setAttribute("d", SD[sg]);
          sv.appendChild(pe);
          var tl = 0;
          try { tl = pe.getTotalLength() || 0; } catch (e) { tl = 0; }
          if (tl <= 0) continue;
          var nseg = Math.max(8, Math.round(tl / 1.5)), seg = [];
          for (var sj = 0; sj <= nseg; sj++) {
            var pt9 = pe.getPointAtLength(tl * sj / nseg);
            seg.push([pt9.x, pt9.y]);
            if (pt9.x < rx0) rx0 = pt9.x;
            if (pt9.x > rx1) rx1 = pt9.x;
            if (pt9.y < ry0) ry0 = pt9.y;
            if (pt9.y > ry1) ry1 = pt9.y;
          }
          segs.push(seg);
        }
        document.body.removeChild(sv);
        if (!segs.length || rx1 - rx0 < 1 || ry1 - ry0 < 1) return;
        var ksx = (bx1 - bx0) / (rx1 - rx0), ksy = (by1 - by0) / (ry1 - ry0);
        for (var s2 = 0; s2 < segs.length; s2++) {
          var sg2 = segs[s2];
          for (var s3 = 0; s3 < sg2.length; s3++) {
            trkX.push(bx0 + (sg2[s3][0] - rx0) * ksx);
            trkY.push(by0 + (sg2[s3][1] - ry0) * ksy);
            trkPen.push(0);
          }
          trkPen[trkPen.length - 1] = 1;      // 这一笔收笔 → 与下一笔之间是提笔空隙
        }
        var GAP = (bx1 - bx0) * 0.012, acc = 0;
        for (var s4 = 0; s4 < trkX.length; s4++) {
          if (s4 > 0) {
            var ddx = trkX[s4] - trkX[s4 - 1], ddy = trkY[s4] - trkY[s4 - 1];
            acc += Math.sqrt(ddx * ddx + ddy * ddy);
            if (trkPen[s4 - 1]) acc += GAP;   // 提笔空隙
          }
          trkS.push(acc);
        }
        trkN = trkX.length;
        trkL = acc > 1e-4 ? acc : 1;
      })();

      // ④ 每个墨迹像素的书写时间 = 轨迹上离它最近的那一点的弧长。
      //    这就是"笔尖扫到哪儿、哪儿的墨就出现"：笔顺完全由数据决定，没有任何猜测成分。
      //    为什么不用"从笔尖出发沿墨迹累加距离"（Dijkstra 时间场）：那样算出来的时刻是
      //    "空间上多久能走到"，而轨迹的弧长比水平距离长得多（笔1 的"a+b"有绕圈和升部，
      //    弧长 892px 只横跨 179px），于是早笔的距离场会把空间相邻、笔序很晚的墨也提前染上色
      //    —— 实测"about"整词都被并进了第一笔的时间窗，画面上就是"一大片横向一起亮"。
      //    直接取最近轨迹点：笔序单调，不会串色。（用 16px 网格 + 逐圈外扩加速，避免
      //    45960 个墨迹像素 × 2087 个轨迹点的全量比较。）
      var timeOf = new Float32Array(N);
      timeOf.fill(-1);
      if (trkN > 1) {
        var CELL = 16, gw = Math.max(1, Math.ceil(W / CELL)), gh = Math.max(1, Math.ceil(H / CELL));
        var gsum = new Int32Array(gw * gh + 1), gg, gk, gcell;
        for (gg = 0; gg < trkN; gg++) {
          gk = Math.min(gh - 1, (trkY[gg] / CELL) | 0) * gw + Math.min(gw - 1, (trkX[gg] / CELL) | 0);
          gsum[gk + 1]++;
        }
        for (gg = 0; gg < gw * gh; gg++) gsum[gg + 1] += gsum[gg];
        var gidx = new Int32Array(trkN), gfill = gsum.slice(0, gw * gh);
        for (gg = 0; gg < trkN; gg++) {
          gk = Math.min(gh - 1, (trkY[gg] / CELL) | 0) * gw + Math.min(gw - 1, (trkX[gg] / CELL) | 0);
          gidx[gfill[gk]++] = gg;
        }
        for (p = 0; p < N; p++) {
          if (!mask[p]) continue;
          var qx3 = p % W, qy3 = (p - qx3) / W;
          var cgx = Math.min(gw - 1, (qx3 / CELL) | 0), cgy = Math.min(gh - 1, (qy3 / CELL) | 0);
          var bd3 = 1e36, bj3 = -1, rr, gx3, gy3;
          for (rr = 0; rr <= 9; rr++) {
            for (gy3 = cgy - rr; gy3 <= cgy + rr; gy3++) {
              if (gy3 < 0 || gy3 >= gh) continue;
              for (gx3 = cgx - rr; gx3 <= cgx + rr; gx3++) {
                if (gx3 < 0 || gx3 >= gw) continue;
                // 只看本圈新扩出来的一层（内层上一圈已经比过了）
                if (rr > 0 && Math.abs(gx3 - cgx) < rr && Math.abs(gy3 - cgy) < rr) continue;
                gcell = gy3 * gw + gx3;
                for (var j5 = gsum[gcell], j5e = gsum[gcell + 1]; j5 < j5e; j5++) {
                  var tj = gidx[j5], tdx3 = trkX[tj] - qx3, tdy3 = trkY[tj] - qy3;
                  var td3 = tdx3 * tdx3 + tdy3 * tdy3;
                  if (td3 < bd3) { bd3 = td3; bj3 = tj; }
                }
              }
            }
            if (bj3 >= 0 && rr >= 1 && bd3 <= (rr * CELL) * (rr * CELL)) break;  // 外圈不可能更近
          }
          if (bj3 < 0) {                                  // 兜底：整条轨迹扫一遍
            for (var j6 = 0; j6 < trkN; j6++) {
              var ux6 = trkX[j6] - qx3, uy6 = trkY[j6] - qy3;
              var ud6 = ux6 * ux6 + uy6 * uy6;
              if (ud6 < bd3) { bd3 = ud6; bj3 = j6; }
            }
          }
          if (bj3 >= 0) timeOf[p] = trkS[bj3];
        }
      }

      // ⑤ 压平成紧凑数组：揭示时刻 = 最近轨迹点的弧长 / 轨迹总弧长（0..1）。
      //    与笔尖共用同一个弧长尺度 ⇒ 笔尖到哪儿、哪儿的墨正好显完；提笔空隙那一段没有
      //    墨迹对应 ⇒ 画面上就是"抬笔挪到下一起笔点"的短暂停顿。
      inkOff = new Int32Array(inkN);
      inkA = new Uint8Array(inkN);
      inkT = new Float32Array(inkN);
      var n2 = 0;
      for (p = 0; p < N; p++) {
        if (!mask[p]) continue;
        inkOff[n2] = p * 4;
        inkA[n2] = d[p * 4 + 3];
        inkT[n2] = (trkN > 1 && timeOf[p] >= 0) ? clamp(timeOf[p] / trkL, 0, 1) : ((p % W) / (W - 1));
        n2++;
      }
      buildRainbow(W);
      drawn = -1;
      ready = true;
    }

    function render(p) {
      if (!ready || !imgData) return;
      p = clamp(p, 0, 1);
      if (p === drawn) return;
      drawn = p;
      var d = imgData.data, n = inkOff.length, k, off, a, t, x;
      for (k = 0; k < n; k++) {
        off = inkOff[k]; a = inkA[k]; t = inkT[k];
        if (t <= p) {
          x = (off >> 2) % W;
          d[off] = colR[x]; d[off + 1] = colG[x]; d[off + 2] = colB[x]; d[off + 3] = a;
        } else {
          d[off] = 255; d[off + 1] = 255; d[off + 2] = 255;   // 未写到：极淡的白幽灵（全貌提示）
          d[off + 3] = a > 12 ? (a * 0.12) | 0 : 0;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      pen(p);
    }

    // 笔尖：直接沿"书写轨迹"走（轨迹自带笔顺），进度按弧长定位（设备像素 → CSS 像素）；
    //       朝向取前后各 2 个轨迹点的方向；提笔空隙处把笔尖藏起来（别让它横滑过去）。
    function pen(p) {
      if (p <= 0 || p >= 1 || trkN < 2) { if (penOn) { penOn = false; penEl.style.opacity = "0"; } return; }
      var target = p * trkL, idx = 0;
      while (idx < trkN - 1 && trkS[idx + 1] <= target) idx++;
      if (trkPen[idx]) {                              // 落在提笔空隙里：抬笔状态
        if (penOn) { penOn = false; penEl.style.opacity = "0"; }
        penInit = false;
        return;
      }
      var xa = trkX[idx], ya = trkY[idx];
      var i0 = idx > 2 ? idx - 2 : 0, i1 = idx + 2 < trkN ? idx + 2 : trkN - 1;
      var dxk = trkX[i1] - trkX[i0], dyk = trkY[i1] - trkY[i0];
      var cx = xa / dpr, cy = ya / dpr;
      if (!penInit) { penX = cx; penY = cy; penInit = true; }
      penX = penX + (cx - penX) * 0.5;
      penY = penY + (cy - penY) * 0.5;
      if (Math.abs(dxk) + Math.abs(dyk) > 0.5) penAng = Math.atan2(dyk, dxk) * 180 / Math.PI;
      penEl.style.left = penX.toFixed(1) + "px";
      penEl.style.top = penY.toFixed(1) + "px";
      penEl.style.transform = "rotate(" + penAng.toFixed(1) + "deg)";
      if (!penOn) { penOn = true; penEl.style.opacity = "1"; }
    }

    function play() {
      if (!ready || playing) return;
      playing = true;
      started = true;
      if (!LOOP) window.removeEventListener("scroll", check);
      var t0 = null;
      function frame(now) {
        if (t0 === null) t0 = now;
        var p = (now - t0) / DUR;
        if (p > 1) p = 1;
        render(p * p * (3 - 2 * p));  // smoothstep：起笔轻 → 行笔稳 → 收笔缓
        if (p < 1) requestAnimationFrame(frame);
        else {
          playing = false;
          if (LOOP) window.setTimeout(function () { render(0); penInit = false; play(); }, 900);
        }
      }
      requestAnimationFrame(frame);
    }

    function visible() {
      var r = wordEl.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      return r.top < vh * TRIGGER && r.bottom > 0;
    }
    function check() { if (visible()) play(); }

    function onResize() {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(function () {
        build();
        if (!ready) return;
        if (started || isShot || reduceMotion) render(1);
        else { render(0); check(); }
      }, 160);
    }

    function init() {
      build();
      if (!ready) return;
      if (isShot || reduceMotion) {           // 截图 / 减少动效：直接完整显示
        render(1);
        penEl.style.opacity = "0";
        return;
      }
      render(0);
      window.addEventListener("scroll", check, { passive: true });
      window.addEventListener("resize", onResize, { passive: true });
      // 点一下单词 = 重播（评审时不用反复刷新；?replay=1 则是自动循环）
      wordEl.addEventListener("click", function () {
        if (playing) return;
        render(0); penInit = false; play();
      });
      check();
      window.setTimeout(check, 400);   // 兜底：直接落在本屏 / 锚点跳转
    }

    // 等字体真正就绪再量字，否则量到的是后备字体字宽，缩放会错
    if (document.fonts && document.fonts.load) {
      document.fonts.load('400 150px "Pacifico"').then(init, init);
    } else {
      init();
    }
  })();
})();

/* =========================================================
   视差背景（v2 追加）
   首屏之后淡入“太阳 + 分层山峦”背景；滚动时各层位移按 data-px
   分层推进（远小近大），形成景深。位移被归一化到 0..1 进度内，
   因此不会随页面无限增长而跑出视口。
   ========================================================= */
(function () {
  "use strict";

  var bg = document.getElementById("bgParallax");
  if (!bg) return;

  var isShot = /[?&]shot=1/.test(window.location.search);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hero = document.querySelector(".hero");
  var layers = bg.querySelectorAll("[data-px]");

  var start = 0;
  var span = 1;

  function measure() {
    // 首屏走完约 3/4 时开始淡入，滚动到 About 屏时已经可见
    start = (hero ? hero.offsetHeight : window.innerHeight) * 0.75;
    span = Math.max(
      document.documentElement.scrollHeight - window.innerHeight - start,
      1
    );
  }

  function update() {
    var y = window.scrollY;

    if (isShot) {
      document.body.classList.add("is-parallax-on");
    } else {
      document.body.classList.toggle("is-parallax-on", y > start);
    }

    if (reduce) return;

    var p = Math.min(Math.max((y - start) / span, 0), 1);
    for (var i = 0; i < layers.length; i++) {
      var el = layers[i];
      var d = parseFloat(el.getAttribute("data-px")) || 0;
      el.style.transform = "translate3d(0," + (-p * d).toFixed(2) + "px,0)";
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    measure();
    onScroll();
  });

  measure();
  update();
})();

/* =========================================================
   足迹拼图（v2 追加）
   10 张大小不同的圆角卡片，在滚到该板块时“从四面八方涌入”，
   按角度排序错峰归位，最终严丝合缝拼成一个完整矩形。
   - 每张卡片的起点方向 = 它相对拼图中心的方向，距离按远近归一化；
   - 位移用 translate3d + scale + blur，只走合成层，不动布局。
   ========================================================= */
(function () {
  "use strict";

  var mosaic = document.querySelector("[data-mosaic]");
  if (!mosaic) return;

  var tiles = Array.prototype.slice.call(mosaic.children);
  if (!tiles.length) return;

  var isShot = /[?&]shot=1/.test(window.location.search);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var STEP = 0.10; /* 每张卡片之间的错峰间隔（秒）：更明显的依次登场 */
  var maxDelay = 0;

  /* 用 offsetLeft/offsetTop 而不是 getBoundingClientRect：
     后者会被已经施加的 transform 影响，导致起点被重复叠加。 */
  function layout() {
    var w = mosaic.offsetWidth;
    var h = mosaic.offsetHeight;
    if (!w || !h) return;

    var spreadX = w * 0.46;
    var spreadY = Math.max(h * 0.55, 240);
    var angles = [];

    tiles.forEach(function (el) {
      var nx = (el.offsetLeft + el.offsetWidth / 2 - w / 2) / (w / 2);
      var ny = (el.offsetTop + el.offsetHeight / 2 - h / 2) / (h / 2);
      var len = Math.sqrt(nx * nx + ny * ny);
      /* 位于正中心的卡片给一个固定角度，避免方向退化 */
      var ang = len < 0.001 ? -2.1 : Math.atan2(ny, nx);
      /* 越靠外的卡片飞得越远，但保底也有一段距离 */
      var rad = Math.min(Math.max(len, 0.55), 1.5);
      angles.push(ang);

      el.style.setProperty("--dx", (Math.cos(ang) * rad * spreadX).toFixed(1) + "px");
      el.style.setProperty("--dy", (Math.sin(ang) * rad * spreadY).toFixed(1) + "px");
      el.style.setProperty("--sc", (0.9 - rad * 0.05).toFixed(3));
    });

    /* 按角度排序 → 像一圈涟漪依次涌入，而不是从上到下扫过 */
    var order = angles
      .map(function (a, i) {
        return i;
      })
      .sort(function (a, b) {
        return angles[a] - angles[b];
      });
    order.forEach(function (idx, rank) {
      var d = rank * STEP;
      tiles[idx].style.setProperty("--d", d.toFixed(3) + "s");
      if (d > maxDelay) maxDelay = d;
    });
  }

  function play() {
    mosaic.classList.add("is-in");
    /* 全部归位后收尾：释放 will-change、切换成悬停微动的过渡 */
    window.setTimeout(function () {
      mosaic.classList.add("is-done");
    }, maxDelay * 1000 + 1870);
  }

  /* 截图模式 / 减少动效：直接定格成拼好的矩形，不播放动画 */
  if (isShot || reduce) {
    tiles.forEach(function (el) {
      el.style.transition = "none";
    });
    mosaic.classList.add("is-in", "is-done");
    return;
  }

  /* 先算好起点，再上锁（is-armed）——顺序不能反，否则量到的是位移后的位置 */
  layout();
  mosaic.classList.add("is-armed");

  var started = false;
  var TRIGGER = 0.8; /* 拼图顶边升到视口 80% 高度处（刚进入视野下沿）才开演 */

  function visible() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    return mosaic.getBoundingClientRect().top < vh * TRIGGER;
  }

  function start() {
    if (started) return;
    started = true;
    /* 一旦开演就摘掉监听，之后滚动零开销 */
    window.removeEventListener("scroll", check);
    window.removeEventListener("resize", check);
    layout(); /* 用滚动到位时的最终尺寸再校正一次 */
    play();
  }

  /* 触发条件 = 「拼图真的进入视野了」，不能用这两种：
     - 可见面积比例 threshold：拼图比视口高得多时（窄屏/手机）永远达不到比例，
       只能靠兜底，退化成"加载即播放"；
     - 加载后 N 秒兜底定时器：页面还停在首屏时动画就播完了，
       用户滚到这一页只剩一个拼好的静态结果，完全看不到"从四周涌入"。 */
  function check() {
    if (visible()) start();
  }

  window.addEventListener("scroll", check, { passive: true });
  window.addEventListener("resize", check);

  /* 首帧先量一次：刷新、带 hash 直接落到页面中段时也要能触发 */
  if (document.readyState === "complete") check();
  else window.addEventListener("load", check);
  window.setTimeout(check, 400);

  /* 窗口尺寸变化时重算起点（已归位后就不必再算） */
  var rt;
  window.addEventListener("resize", function () {
    if (mosaic.classList.contains("is-in")) return;
    window.clearTimeout(rt);
    rt = window.setTimeout(layout, 180);
  });
})();

/* =========================================================
   首屏视频背景（v2 追加）
   静音循环播放 assets/hero/hero-loop.mp4，成功接管后才给 .hero 加
   is-video 淡入（视频层 + 压暗遮罩同时显现，星空让位）。
   - 自动播放被拦截 / 解码失败 → 不加 is-video，静默回落到夜景渐变；
   - ?shot=1（截图）与 prefers-reduced-motion → 只显示封面静帧，不播放；
   - 标签页切到后台时暂停，回来续播（省电，且不产生跳帧）。
   ========================================================= */
(function () {
  "use strict";

  var hero = document.querySelector(".hero");
  if (!hero) return;

  var video = hero.querySelector(".hero__video");
  if (!video) return;

  var isShot = /[?&]shot=1/.test(window.location.search);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function show() {
    hero.classList.add("is-video");
  }
  function hide() {
    hero.classList.remove("is-video");
  }

  /* 播放/加载失败 → 安静回落到原有渐变背景，不抛错 */
  video.addEventListener("error", hide);
  var source = video.querySelector("source");
  if (source) source.addEventListener("error", hide);

  /* 背景视频必须静音，否则任何浏览器都不允许自动播放 */
  video.muted = true;
  video.setAttribute("muted", "");
  video.setAttribute("playsinline", "");

  /* 截图模式 / 减少动效：定格在封面帧，画面确定且可复现 */
  if (isShot || reduce) {
    try {
      video.pause();
    } catch (e) {
      /* 忽略：暂停失败不影响静帧展示 */
    }
    show();
    return;
  }

  var started = video.play();
  if (started && typeof started.then === "function") {
    started.then(show, hide);
  } else {
    show();
  }

  /* 切到后台暂停、切回续播：避免常驻解码耗电 */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      video.pause();
      return;
    }
    var again = video.play();
    if (again && typeof again.catch === "function") {
      again.catch(function () {
        /* 续播被拒也不影响：保持当前静帧 */
      });
    }
  });
})();

/* =========================================================
   01 关于 · 左栏照片墙：随滚动依次交叉渐显
   四张照片按书写顺序叠放，用「关于我」整块在视口里走过的行程当进度条：
   滚下去时前一张淡出、后一张淡入（后写的在上层，所以视觉上是一次干净的溶解），
   停在最后一张证件照上。进度只由滚动位置决定 → 往回滚能原路返回，
   不会出现"一动就回不去"的单向状态；减少动效时直接定格在最后一张。
   CSS 里第一张默认 opacity:1，脚本没跑（或报错）时也不会开天窗。
   ========================================================= */
(function () {
  var frame = document.querySelector(".about-photo__frame");
  var block = document.querySelector(".about-main");
  if (!frame || !block) return;

  var imgs = frame.querySelectorAll(".about-photo__img");
  var n = imgs.length;
  if (n < 2) return;

  var SEG = 1 / n;      /* 每张照片独占的行程比例 */
  var OVERLAP = 0.55;   /* 交叉渐显的重叠宽度（按 SEG 计）：越大越柔和 */
  var fade = SEG * OVERLAP;
  var ticking = false;

  function clamp01(v) {
    return v < 0 ? 0 : v > 1 ? 1 : v;
  }

  /* 进度 t：区块上沿刚到视口 72% 处（照片才露头、reveal 也已触发）记 0，
     区块再往上走 0.1 个自身高度记 1——那时照片正好停在贴顶位置，四张刚好走完，
     最后一张证件照便成了"栏目停住时"的画面。桌面左右排布、手机上下排布都成立。 */
  function progress(rect, vh) {
    var from = vh * 0.72;
    var to = -rect.height * 0.1;
    var span = from - to;
    return span > 0 ? clamp01((from - rect.top) / span) : 0;
  }

  function paint() {
    ticking = false;
    var vh = window.innerHeight;
    var t = progress(block.getBoundingClientRect(), vh);

    for (var i = 0; i < n; i++) {
      var start = i * SEG;
      var inA = clamp01((t - start + fade) / fade);
      var outA = clamp01((start + SEG + fade - t) / fade);
      imgs[i].style.opacity = String(Math.round(Math.min(inA, outA) * 1000) / 1000);
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(paint);
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    /* 减少动效：不做随滚动的渐显，定格在最后一张（证件照） */
    for (var i = 0; i < n - 1; i++) imgs[i].style.opacity = "0";
    imgs[n - 1].style.opacity = "1";
    return;
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  paint();
})();
