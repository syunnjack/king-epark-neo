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

simulateWaitStatus();
wireReserveForm();
wireReviewForm();
