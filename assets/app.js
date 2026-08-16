// Client-side enhancement layer only. All critical content (store info,
// menu, FAQ, reviews) is already present in the static HTML above -- this
// script only adds interactivity on top, so AI/search crawlers that don't
// execute JavaScript still see everything that matters.

function simulateWaitStatus() {
  const minutesEl = document.getElementById("wait-minutes");
  const groupsEl = document.getElementById("wait-groups");
  if (!minutesEl) return;

  function tick() {
    const groups = Math.floor(Math.random() * 6);
    const minutes = groups * 5 + Math.floor(Math.random() * 5);
    minutesEl.textContent = minutes === 0 ? "待ちなし" : `約${minutes}分`;
    if (groupsEl) {
      groupsEl.textContent =
        groups === 0
          ? "現在お待ちのお客様はいません（自動更新）"
          : `現在 ${groups}組のお客様がお待ちです（自動更新）`;
    }
  }

  tick();
  setInterval(tick, 15000);
}

function wireReserveForm() {
  const form = document.getElementById("reserve-form");
  if (!form) return;

  const modeSelect = document.getElementById("reserve-mode");
  const datetimeInput = document.getElementById("reserve-datetime");

  function syncDatetimeRequirement() {
    const scheduled = modeSelect.value === "scheduled";
    datetimeInput.required = scheduled;
    datetimeInput.closest("label").style.opacity = scheduled ? "1" : "0.5";
  }
  modeSelect.addEventListener("change", syncDatetimeRequirement);
  syncDatetimeRequirement();

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const mode = data.get("mode");
    const receiptNumber = Math.floor(100 + Math.random() * 900);
    const resultEl = document.getElementById("reserve-result");

    if (mode === "queue") {
      const estimatedMinutes = Math.floor(Math.random() * 6) * 5;
      resultEl.innerHTML = `
        <div class="card">
          <strong>受付番号: ${receiptNumber}番</strong>
          <p>${data.get("name")}様、${data.get("party_size")}での順番待ち登録を受け付けました。
          呼び出しまでの目安は約${estimatedMinutes}分です（このデモでは実際の通知は送信されません）。</p>
        </div>`;
    } else {
      resultEl.innerHTML = `
        <div class="card">
          <strong>予約受付番号: ${receiptNumber}番</strong>
          <p>${data.get("name")}様、${data.get("datetime") || "指定日時"}に${data.get(
        "party_size"
      )}でのご予約を受け付けました（このデモでは実際の確認メールは送信されません）。</p>
        </div>`;
    }
    form.reset();
    syncDatetimeRequirement();
  });
}

function wireReviewForm() {
  const form = document.getElementById("review-form");
  if (!form) return;

  const STORAGE_KEY = "king-epark-neo.local-reviews";
  const section = document.getElementById("review-submitted");
  const list = document.getElementById("local-reviews");
  const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

  function render() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (saved.length === 0) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    list.innerHTML = saved
      .map(
        (r) => `
      <div class="card review-card">
        <div class="stars">${stars(r.rating)}</div>
        <div class="review-meta">${r.author} / ${r.date}（このブラウザのみに保存）</div>
        <p>${r.text}</p>
      </div>`
      )
      .join("");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    saved.push({
      author: data.get("author"),
      rating: Number(data.get("rating")),
      text: data.get("text"),
      date: new Date().toISOString().slice(0, 10),
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    form.reset();
    render();
  });

  render();
}

/**
 * mailto ボタンの取りこぼしを埋める。
 *
 * メールソフトが設定されていない端末では、mailto: を押しても何も起きない。
 * ブラウザは何のエラーも出さないので、押した側からは「ボタンが壊れている」
 * ようにしか見えない。実際そういう問い合わせを受けた。
 *
 * 宛先を画面にも出し、その場でコピーできるようにしておけば、
 * メールソフトが開かない端末でも応募の手段が残る。
 */
function wireMailFallback() {
  const buttons = document.querySelectorAll('a.btn[href^="mailto:"]');

  for (const button of buttons) {
    const address = decodeURIComponent(button.getAttribute("href").slice(7).split("?")[0]);
    if (!address) continue;

    const note = document.createElement("p");
    note.className = "mail-fallback";

    const lead = document.createElement("span");
    lead.textContent = "メールソフトが開かない場合は ";

    const code = document.createElement("code");
    code.textContent = address;

    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy-mail";
    copy.textContent = "コピー";

    const status = document.createElement("span");
    status.className = "copy-status";
    status.setAttribute("role", "status");

    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(address);
        status.textContent = "コピーしました";
      } catch {
        // 権限が無い、あるいは古いブラウザ。選択状態にして手動コピーに委ねる
        const range = document.createRange();
        range.selectNodeContents(code);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        status.textContent = "選択しました。コピーしてください";
      }
      setTimeout(() => {
        status.textContent = "";
      }, 4000);
    });

    note.append(lead, code, " 宛にお送りください ", copy, " ", status);
    (button.closest(".cta-row") ?? button).after(note);
  }
}

/**
 * モニター応募フォーム。
 *
 * 送信先（assets/form-config.js）が空のあいだは、フォームを出さずに
 * メール案内だけを残す。送信できないフォームを置くと、
 * 送ったつもりで届かない、という一番まずい状態になるため。
 *
 * 送信先が入っていれば、フォームを出してメール案内を下げる。
 */
function wireMonitorForm() {
  const form = document.getElementById("monitor-form");
  if (!form) return;

  const endpoint = (window.MONITOR_FORM_ENDPOINT || "").trim();
  const mailGuide = document.getElementById("monitor-mail-guide");
  const result = document.getElementById("monitor-form-result");
  if (!endpoint) return;

  form.hidden = false;
  if (mailGuide) mailGuide.hidden = true;

  // 上部のCTAも、メールではなくフォームへ向ける。
  // フォームがあるのにボタンだけメールのまま、という食い違いを残さない。
  for (const cta of document.querySelectorAll('a.btn[href^="mailto:"]')) {
    cta.setAttribute("href", "#how-to-apply");
    cta.textContent = "応募フォームへ";
  }

  const isGoogleForm = endpoint.includes("docs.google.com");
  const fieldMap = window.MONITOR_FORM_FIELD_MAP || {};

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;
    result.textContent = "送信しています…";

    const data = new FormData(form);

    try {
      if (isGoogleForm) {
        // Google フォームは CORS を返さないので、応答は読めない。
        // no-cors で投げ、成功したものとして扱う。
        const params = new URLSearchParams();
        for (const [key, value] of data.entries()) {
          const entry = fieldMap[key];
          if (entry) params.append(entry, value);
        }
        await fetch(endpoint, { method: "POST", mode: "no-cors", body: params });
      } else {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { Accept: "application/json" },
          body: data,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      }

      form.hidden = true;
      result.innerHTML = `
        <div class="card">
          <strong>お申し込みを受け付けました</strong>
          <p>1週間程度で内容を確認し、ご記入いただいたメールアドレスへご返信します。</p>
        </div>`;
    } catch (err) {
      // 落ちたことを黙って隠さない。メールという逃げ道も示す
      result.innerHTML = `
        <div class="card">
          <strong>送信できませんでした</strong>
          <p>お手数ですが、時間をおいて再度お試しいただくか、
          <a href="mailto:monitor@junbannavi.com">monitor@junbannavi.com</a> までメールでご連絡ください。</p>
        </div>`;
      button.disabled = false;
    }
  });
}

simulateWaitStatus();
wireReserveForm();
wireReviewForm();
wireMonitorForm();
wireMailFallback();
