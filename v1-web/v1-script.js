/* =========================================================
   v1-script.js — 江沁钊个人主页交互
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

  /* ---------- 社交卡片跳转 ----------
     B站 为真实链接（href 非 "#"），直接放行跳转；
     抖音 / 视频号 为占位（href="#"），点击时给出占位提示。 */
  document.querySelectorAll(".social-card").forEach(function (card) {
    var href = card.getAttribute("href") || "#";
    if (href !== "#") {
      return; // 真实链接：交给默认跳转
    }
    card.addEventListener("click", function (e) {
      e.preventDefault();
      var platform = card.getAttribute("data-platform") || "外部链接";
      // 占位提示：后续可替换为真实主页链接
      alert("《" + platform + "》链接暂未配置，后续会替换为你的真实主页。");
    });
  });

  /* ---------- 笔尖书写动效（[data-write]）----------
     用一道柔和的"墨迹"前沿从左向右扫过标题，文字像被笔尖
     一笔一画书写出来（随滚动推进；hero 大标题则在加载时书写）。
     · 技术：CSS mask 线性渐变 + --write-progress 变量控制扫到哪，
       无需拆分 DOM，中文/响应式 clamp 均安全；
     · 截图模式（?shot=1）与减少动效偏好下直接整段显示。 */
  var writeEls = document.querySelectorAll("[data-write]");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var writeItems = [];

  if (writeEls.length) {
    writeEls.forEach(function (el) {
      writeItems.push({ el: el, progress: 0, done: false });
    });

    // 当前是否需要关闭动效（初始化时判定一次）
    var writingDisabled = isShot || reduceMotion;

    function applyProgress(item, p) {
      p = Math.max(0, Math.min(1, p));
      item.progress = p;
      item.el.style.setProperty("--write-progress", (p * 100).toFixed(2) + "%");
      if (p >= 1) item.done = true;
    }

    function writeAll(item) {
      applyProgress(item, 1);
    }

    if (writingDisabled) {
      // 截图 / 减少动效：全部直接写出（不挂 mask 类，保持完整可见）
      writeItems.forEach(function (it) {
        it.el.classList.remove("js-write-mask");
        writeAll(it);
      });
    } else {
      // 正常书写：给标题挂上 mask 类，随进度推进
      writeItems.forEach(function (it) {
        it.el.classList.add("js-write-mask");
        applyProgress(it, 0);
      });

      function applyScrollWrite() {
        var vh = window.innerHeight;
        writeItems.forEach(function (item) {
          if (item.done) return;
          if (item.el.classList.contains("hero__title")) return; // hero 走时间轴
          var rect = item.el.getBoundingClientRect();
          // 已滚过视口上方 -> 全部写完
          if (rect.top <= vh * 0.3) {
            writeAll(item);
            return;
          }
          // 尚未进入视口 -> 未开始
          if (rect.top > vh) {
            applyProgress(item, 0);
            return;
          }
          // 从视口下方进入，到 30% 高度处写满：映射为滚动进度
          var p = (vh - rect.top) / (vh - vh * 0.3); // 0..1
          applyProgress(item, p);
        });
      }

      // hero 大标题：加载时用时间轴书写（柔和的由慢渐快）
      var heroItem = null;
      writeItems.forEach(function (it) {
        if (it.el.classList.contains("hero__title")) heroItem = it;
      });
      if (heroItem) {
        var start = null;
        var dur = 1700;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3); // ease-out
          applyProgress(heroItem, eased);
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }

      window.addEventListener("scroll", applyScrollWrite, { passive: true });
      window.addEventListener("resize", applyScrollWrite, { passive: true });
      applyScrollWrite();
    }
  }
})();
