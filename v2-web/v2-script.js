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

  /* ---------- About 简介屏：单笔连笔手写 "About me" ----------
     SVG 幽灵淡线整词显示，墨迹按笔顺用 stroke-dashoffset 逐笔写出，
     笔尖用 getPointAtLength 跟随当前书写点（正序写完）。
     数据来自 v1-about-data.js (window.ABOUT_STROKES)，含 9 个连续笔画。
     截图 / 减少动效：直接显示完整墨迹。 */
  var aboutStrokes = window.ABOUT_STROKES;
  if (aboutStrokes && aboutStrokes.strokeD && aboutStrokes.strokeD.length) {
    var inkEl = document.getElementById("wordInk");
    var penEl = document.getElementById("wordPen");
    var ghostEl = document.getElementById("wordGhost");
    var aboutSection = document.getElementById("about-screen");

    if (inkEl && penEl && ghostEl && aboutSection) {
      var NS = "http://www.w3.org/2000/svg";
      // 幽灵预描：整词淡线（按笔顺组，全部显示作全貌提示）
      aboutStrokes.strokeD.forEach(function (d) {
        var p = document.createElementNS(NS, "path");
        p.setAttribute("d", d);
        p.setAttribute("class", "word-ghost");
        p.setAttribute("fill", "none");
        ghostEl.appendChild(p);
      });
      // 构建墨迹 SVG：把每笔作为独立 path，累积长度以支持正序(笔顺)书写
      var inkGroup = inkEl;
      var strokePaths = aboutStrokes.strokeD.map(function (d) {
        var p = document.createElementNS(NS, "path");
        p.setAttribute("d", d);
        p.setAttribute("class", "word-ink");
        p.setAttribute("fill", "none");
        inkGroup.appendChild(p);
        return p;
      });

      // 测量每笔长度 + 累计起点
      var lens = strokePaths.map(function (p) { return p.getTotalLength(); });
      var totalLen = lens.reduce(function (a, b) { return a + b; }, 0);
      var starts = [];
      var acc = 0;
      var i;
      for (i = 0; i < lens.length; i++) { starts.push(acc); acc += lens[i]; }

      // 全局进度 t in [0,1] -> 每笔的 dashoffset（正序写出，非整词同时泄出）
      function render(t) {
        var g = t * totalLen;
        for (var k = 0; k < strokePaths.length; k++) {
          var L = lens[k];
          strokePaths[k].style.strokeDasharray = L + " " + L;
          strokePaths[k].style.strokeDashoffset = L - Math.max(0, Math.min(L, g - starts[k]));
        }
        // 笔尖定位：找到当前所处笔画，并让纸飞机朝向书写方向
        var idx = lens.length - 1;
        for (var m = 0; m < lens.length; m++) {
          if (g < starts[m] + lens[m]) { idx = m; break; }
        }
        var local = Math.max(0, Math.min(lens[idx], g - starts[idx]));
        var pt = strokePaths[idx].getPointAtLength(local);
        // 取前方一点求方向角（纸飞机机头朝前进方向）
        var ahead = strokePaths[idx].getPointAtLength(Math.min(lens[idx], local + 2));
        var ang = Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180 / Math.PI;
        penEl.setAttribute("transform", "translate(" + pt.x + " " + pt.y + ") rotate(" + ang + ")");
      }

      // 截图 / 减少动效：完整显示 + 隐藏笔尖
      if (isShot || reduceMotion) {
        render(1);
        penEl.style.opacity = 0;
      } else {
        var aboutDone = false;
        var dur = 2200;
        function animateAbout() {
          if (aboutDone) return;
          var start = null;
          function frame(now) {
            if (aboutDone) return;
            if (start === null) start = now;
            var p = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3); // ease-out
            render(eased);
            if (p < 1) {
              requestAnimationFrame(frame);
            } else {
              aboutDone = true;
            }
          }
          requestAnimationFrame(frame);
        }
        // 进入视口即触发书写
        if ("IntersectionObserver" in window) {
          var aboutObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                animateAbout();
                aboutObserver.disconnect();
              }
            });
          }, { threshold: 0.35 });
          aboutObserver.observe(aboutSection);
        } else {
          render(1);
        }
      }
    }
  }
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
  var armed = false;

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
  armed = true;
  mosaic.classList.add("is-armed");

  /* 窗口尺寸变化时重算起点（已归位后就不必再算） */
  var rt;
  window.addEventListener("resize", function () {
    if (mosaic.classList.contains("is-in")) return;
    window.clearTimeout(rt);
    rt = window.setTimeout(layout, 180);
  });

  function start() {
    layout(); /* 用滚动到位时的最终尺寸再校正一次 */
    play();
  }

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            io.unobserve(entry.target);
            start();
          }
        });
      },
      { threshold: 0.16 }
    );
    io.observe(mosaic);
  } else {
    start();
  }

  /* 保险：万一 IntersectionObserver 没有触发（老浏览器/异常），
     2.5 秒后自动播放，避免内容一直停在不可见状态 */
  if (armed) {
    window.setTimeout(function () {
      if (!mosaic.classList.contains("is-in")) start();
    }, 2500);
  }
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
