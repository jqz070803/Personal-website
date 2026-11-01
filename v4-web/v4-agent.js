/* =========================================================
   v4-agent.js — 数字分身对话框
   ---------------------------------------------------------
   依赖 v4-persona.js（window.DIGITAL_TWIN）。

   两种运行方式：
   · 配置了 ENDPOINT  → 走后端 Worker，真实模型回答
   · 没配置 ENDPOINT  → 走本地知识检索，只返回资料原文，不生成
     后者是零风险模式：不联网、不调模型、不可能说出资料以外的话。

   改动 ENDPOINT 后记得改 v4-index.html 里的 ?v= 版本号。
   ========================================================= */
(function () {
  "use strict";

  var DT = window.DIGITAL_TWIN;
  if (!DT) {
    console.warn("[twin] 没找到 DIGITAL_TWIN，检查 v4-persona.js 是否加载。");
    return;
  }

  /* ---------- 配置 ---------- */

  var ENDPOINT = (function () {
    try {
      var local = localStorage.getItem("twin_endpoint");
      if (local) return local;
    } catch (e) {}
    // 腾讯云函数 URL（云函数版不加 /chat）
    return "https://1522915185-7v4d1u85vf.ap-guangzhou.tencentscf.com";
  })();

  /* ---------- DOM ---------- */

  var $ = function (id) { return document.getElementById(id); };

  var gate = $("twinGate");
  var panel = $("twinPanel");
  var log = $("twinLog");
  var form = $("twinForm");
  var input = $("twinText");
  var sendBtn = $("twinSend");
  var chipsBox = $("twinChips");
  var nameEl = $("twinName");
  var subEl = $("twinSub");
  var avatarEl = $("twinAvatar");
  var stateText = $("twinGateStateText");
  var stateDot = $("twinStateDot");

  if (!gate || !panel || !log) return;

  /* ---------- 状态 ---------- */

  var state = {
    mode: "persona",
    history: [],
    busy: false,
    started: false
  };

  var CHIPS = {
    persona: [
      "你是学什么的？",
      "你去过哪些地方？",
      "为什么选这个专业？",
      "你平时怎么安排时间？"
    ],
    traveler: [
      "新疆几月去最好？",
      "青海湖怎么玩？",
      "推荐一条云南路线",
      "你最难忘的一段路是哪"
    ]
  };

  var OPENERS = {
    persona: DT.modes.persona.greeting,
    traveler: DT.modes.traveler.greeting
  };

  var NAME = {
    persona: "江沁钊 · 数字分身",
    traveler: "徐霞客 · 数字分身"
  };

  var AVATAR = { persona: "江", traveler: "徐" };

  /* ---------- 基础工具 ---------- */

  function scrollToEnd() {
    log.scrollTop = log.scrollHeight;
  }

  function addMsg(kind, text, opts) {
    opts = opts || {};
    var wrap = document.createElement("div");
    wrap.className = "twin__msg is-" + (kind === "me" ? "me" : "ai");
    if (opts.guard) wrap.classList.add("is-guard");

    var bubble = document.createElement("div");
    bubble.className = "twin__bubble";
    bubble.textContent = text || "";
    wrap.appendChild(bubble);

    if (opts.tag) {
      var tag = document.createElement("span");
      tag.className = "twin__tag";
      tag.textContent = opts.tag;
      wrap.appendChild(tag);
    }

    log.appendChild(wrap);
    scrollToEnd();
    return wrap;
  }

  function addTyping() {
    var wrap = document.createElement("div");
    wrap.className = "twin__msg is-ai";
    var bubble = document.createElement("div");
    bubble.className = "twin__bubble";
    bubble.innerHTML =
      '<span class="twin__typing"><i></i><i></i><i></i></span>';
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    scrollToEnd();
    return wrap;
  }

  /** 打字机效果：视觉上像流式，但内容其实是一次性拿全的 */
  function typeOut(text, opts) {
    return new Promise(function (resolve) {
      var wrap = addMsg("ai", "", opts);
      var bubble = wrap.querySelector(".twin__bubble");
      var caret = document.createElement("span");
      caret.className = "twin__caret";

      var full = String(text || "");
      var step = full.length > 160 ? 3 : 2;
      var shown = 0;

      var timer = setInterval(function () {
        shown += step;
        var piece = full.slice(0, shown);
        bubble.textContent = piece;
        if (shown < full.length) bubble.appendChild(caret);
        scrollToEnd();
        if (shown >= full.length) {
          clearInterval(timer);
          resolve(wrap);
        }
      }, 18);
    });
  }

  function setBusy(on) {
    state.busy = on;
    sendBtn.disabled = on;
    input.disabled = on;
    panel.classList.toggle("is-busy", on);
  }

  function autoGrow() {
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 120) + "px";
  }

  /* ---------- 本地检索：未配置模型时的兜底 ---------- */

  function localAnswer(question) {
    var blocks = DT.retrieve(question, 1);
    if (!blocks.length) return DT.unknownReply;
    return blocks[0].text;
  }

  /* ---------- 请求后端 ---------- */

  async function askModel(question) {
    var knowledge = DT.buildKnowledgeContext(question, 5);

    if (!ENDPOINT) {
      return { text: localAnswer(question), tag: "资料摘录 · 未接入模型", guard: false };
    }

    var res;
    try {
      res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          mode: state.mode,
          knowledge: knowledge,
          // 去掉最后一条（就是当前这句），后端会自己追加
          history: state.history.slice(0, -1)
        })
      });
    } catch (e) {
      return { text: localAnswer(question), tag: "模型连不上 · 已退回本地资料", guard: false, degraded: true };
    }

    if (res.status === 429) {
      var limited = await res.json().catch(function () { return {}; });
      return { text: limited.message || "问得有点快，歇一分钟再来。", tag: "限流", guard: true };
    }

    if (!res.ok) {
      return { text: localAnswer(question), tag: "模型连不上 · 已退回本地资料", guard: false, degraded: true };
    }

    var data = await res.json().catch(function () { return null; });
    if (!data || !data.reply) {
      return { text: localAnswer(question), tag: "返回异常 · 已退回本地资料", guard: false, degraded: true };
    }

    var tag = "";
    if (data.source === "guard") tag = data.blocked === "detail" ? "未公开细节" : "边界";
    else if (data.source === "output-guard") tag = "";
    else if (data.source === "retrieval") {
      // 后端降级（Key 失效 / 模型名不对 / 额度用完）时，这里会看到资料原文
      tag = data.degraded ? "模型不可用 · 已退回本地资料" : "资料摘录 · 未接入模型";
    }

    return { text: data.reply, tag: tag, guard: !!data.blocked && data.source === "guard" };
  }

  /* ---------- 主流程 ---------- */

  async function send(raw) {
    var text = String(raw || "").trim();
    if (!text || state.busy) return;

    setBusy(true);
    input.value = "";
    autoGrow();

    addMsg("me", text);
    state.history.push({ role: "user", content: text });

    // 前端预检：命中就不发请求，立刻回应（省一次调用，也更快）
    var hit = DT.detectBoundary(text);
    if (hit) {
      var reply = hit.reply;
      // 细节类不是「踩线」，标签要和真正的边界区分开
      var label = hit.id === "detail" ? "未公开细节" : "边界";
      addMsg("ai", reply, { guard: true, tag: label });
      state.history.push({ role: "assistant", content: reply });
      setBusy(false);
      input.focus();
      return;
    }

    var typing = addTyping();
    var result;
    try {
      result = await askModel(text);
    } catch (e) {
      result = { text: localAnswer(text), tag: "出了点问题 · 已退回本地资料", degraded: true };
    }

    typing.remove();
    await typeOut(result.text, { guard: result.guard, tag: result.tag });
    state.history.push({ role: "assistant", content: result.text });

    setBusy(false);
    input.focus();
  }

  /* ---------- 界面切换 ---------- */

  function renderChips() {
    chipsBox.innerHTML = "";
    var list = CHIPS[state.mode] || CHIPS.persona;
    list.forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "twin__chip";
      b.textContent = q;
      b.addEventListener("click", function () {
        send(q);
      });
      chipsBox.appendChild(b);
    });
  }

  function applyModeUI() {
    var m = state.mode;
    nameEl.textContent = NAME[m];
    avatarEl.textContent = AVATAR[m];
    subEl.textContent = "AI 生成 · 不是本人";

    var btns = document.querySelectorAll(".twin__switch-btn");
    for (var i = 0; i < btns.length; i++) {
      var on = btns[i].getAttribute("data-mode") === m;
      btns[i].classList.toggle("is-active", on);
      btns[i].setAttribute("aria-checked", on ? "true" : "false");
    }

    var gateBtns = document.querySelectorAll(".twin__mode");
    for (var j = 0; j < gateBtns.length; j++) {
      var on2 = gateBtns[j].getAttribute("data-mode") === m;
      gateBtns[j].classList.toggle("is-active", on2);
      gateBtns[j].setAttribute("aria-checked", on2 ? "true" : "false");
    }

    renderChips();
  }

  function resetConversation(keepMode) {
    state.history = [];
    log.innerHTML = "";
    if (!keepMode) state.mode = "persona";
    applyModeUI();
    addMsg("ai", OPENERS[state.mode]);
  }

  function startPanel() {
    state.started = true;
    gate.hidden = true;
    panel.hidden = false;
    resetConversation(true);
    setTimeout(function () {
      input.focus();
      panel.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
  }

  /* ---------- 事件绑定 ---------- */

  var startBtn = $("twinStart");
  if (startBtn) {
    startBtn.addEventListener("click", startPanel);
  }

  document.querySelectorAll(".twin__mode").forEach(function (btn) {
    btn.addEventListener("click", function () {
      state.mode = btn.getAttribute("data-mode") || "persona";
      applyModeUI();
    });
  });

  document.querySelectorAll(".twin__switch-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var next = btn.getAttribute("data-mode") || "persona";
      if (next === state.mode) return;
      state.mode = next;
      resetConversation(true);
    });
  });

  var resetBtn = $("twinReset");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      resetConversation(true);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    send(input.value);
  });

  input.addEventListener("input", autoGrow);

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input.value);
    }
  });

  /* ---------- 初始化 ---------- */

  if (ENDPOINT) {
    if (stateDot) stateDot.setAttribute("data-state", "online");
    if (stateText) stateText.textContent = "AI 模式 · 已接入模型";
  } else {
    if (stateDot) stateDot.setAttribute("data-state", "local");
    if (stateText) stateText.textContent = "本地知识库模式 · 只回资料原文";
  }

  applyModeUI();
})();
