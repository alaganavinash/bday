// The secret hunt, shared by every page: remembers which secrets were found
// (in localStorage, so progress survives a reload or a second visit),
// draws the basket tracker + hint panel, and announces each find.
// Page scripts call EGGS.find(id) and listen for the "eggs:change" event.
(function () {
  "use strict";

  const KEY = "bday-eggs-v1";
  const list = SITE.eggs;
  const total = list.length;

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY));
      if (!Array.isArray(saved)) return [];
      return saved.filter(function (id) { return list.some(function (e) { return e.id === id; }); });
    } catch (err) {
      return [];
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(found)); } catch (err) { /* private mode: progress lasts this visit only */ }
  }

  let found = load();
  if (new URLSearchParams(location.search).has("reset")) {
    found = [];
    save();
  }

  const eggSvg = '<svg viewBox="0 0 24 30" aria-hidden="true"><path d="M12 1.5C6.5 1.5 2.5 11 2.5 18.5a9.5 9.5 0 0 0 19 0C21.5 11 17.5 1.5 12 1.5z"/></svg>';

  // ---------- Basket button ----------
  const basket = document.createElement("button");
  basket.type = "button";
  basket.className = "basket";
  basket.setAttribute("aria-controls", "basketPanel");
  basket.setAttribute("aria-expanded", "false");
  basket.innerHTML = eggSvg + '<span class="basket__count"></span>';

  // ---------- Hint panel ----------
  const panel = document.createElement("aside");
  panel.className = "basket-panel";
  panel.id = "basketPanel";
  panel.hidden = true;
  panel.innerHTML =
    '<div class="basket-panel__head">' +
      '<div><p class="basket-panel__eyebrow">the hunt</p><h2 class="basket-panel__title">Secrets found</h2></div>' +
      '<button type="button" class="basket-panel__close" aria-label="Close">&times;</button>' +
    '</div>' +
    '<div class="basket-panel__bar"><span></span></div>' +
    '<ol class="basket-panel__list"></ol>' +
    '<button type="button" class="basket-panel__reset">Hide them all again</button>';

  const toastEl = document.createElement("div");
  toastEl.className = "petal-toast";
  toastEl.setAttribute("role", "status");
  toastEl.hidden = true;

  document.body.appendChild(basket);
  document.body.appendChild(panel);
  document.body.appendChild(toastEl);

  const listEl = panel.querySelector(".basket-panel__list");
  const barEl = panel.querySelector(".basket-panel__bar span");

  function render() {
    basket.querySelector(".basket__count").textContent = found.length + "/" + total;
    basket.setAttribute("aria-label", found.length + " of " + total + " secrets found. Show hints.");
    basket.classList.toggle("complete", found.length === total);
    barEl.style.width = (found.length / total) * 100 + "%";

    listEl.innerHTML = "";
    list.forEach(function (egg) {
      const isFound = found.indexOf(egg.id) !== -1;
      const li = document.createElement("li");
      li.className = "egg-row" + (isFound ? " found" : "");
      li.innerHTML = eggSvg;

      const body = document.createElement("div");
      const title = document.createElement("p");
      title.className = "egg-row__title";
      title.textContent = isFound ? egg.title : "???";
      body.appendChild(title);

      if (!isFound) {
        const details = document.createElement("details");
        const summary = document.createElement("summary");
        summary.textContent = "need a hint?";
        const hint = document.createElement("p");
        hint.textContent = egg.hint;
        details.appendChild(summary);
        details.appendChild(hint);
        body.appendChild(details);
      }
      li.appendChild(body);
      listEl.appendChild(li);
    });
  }

  function openPanel() {
    panel.hidden = false;
    basket.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { panel.classList.add("open"); });
    });
  }

  function closePanel() {
    if (panel.hidden) return;
    panel.classList.remove("open");
    basket.setAttribute("aria-expanded", "false");
    setTimeout(function () { panel.hidden = true; }, 250);
  }

  basket.addEventListener("click", function () {
    if (panel.hidden) openPanel(); else closePanel();
  });
  panel.querySelector(".basket-panel__close").addEventListener("click", closePanel);
  document.addEventListener("click", function (e) {
    if (!panel.contains(e.target) && !basket.contains(e.target)) closePanel();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closePanel();
  });

  panel.querySelector(".basket-panel__reset").addEventListener("click", function () {
    if (!window.confirm("Hide all the secrets again?")) return;
    found = [];
    save();
    render();
    document.dispatchEvent(new CustomEvent("eggs:change", { detail: { reset: true } }));
  });

  // ---------- Toasts (queued so finds never talk over each other) ----------
  const queue = [];
  let showing = false;

  function toast(text) {
    queue.push(text);
    if (!showing) nextToast();
  }

  function nextToast() {
    if (!queue.length) { showing = false; return; }
    showing = true;
    toastEl.textContent = queue.shift();
    toastEl.hidden = false;
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { toastEl.classList.add("in-view"); });
    });
    setTimeout(function () {
      toastEl.classList.remove("in-view");
      setTimeout(function () { toastEl.hidden = true; nextToast(); }, 500);
    }, 3200);
  }

  // ---------- Finding a secret ----------
  function find(id) {
    if (found.indexOf(id) !== -1) return false;
    const egg = list.find(function (e) { return e.id === id; });
    if (!egg) return false;

    found.push(id);
    save();
    render();

    basket.classList.remove("bump");
    void basket.offsetWidth;
    basket.classList.add("bump");

    if (typeof spawnConfetti === "function") {
      const r = basket.getBoundingClientRect();
      spawnConfetti(r.left + r.width / 2, r.bottom, 50);
    }

    toast("Secret found: " + egg.title + " · " + found.length + "/" + total);
    if (found.length === total) {
      toast("Every secret found. Your letter is unsealed. Scroll down. ✉️");
    }

    document.dispatchEvent(new CustomEvent("eggs:change", { detail: { id: id } }));
    return true;
  }

  // ---------- Bonus (not counted): the Konami code on a keyboard ----------
  const konami = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
  let konamiPos = 0;
  document.addEventListener("keydown", function (e) {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    konamiPos = key === konami[konamiPos] ? konamiPos + 1 : (key === konami[0] ? 1 : 0);
    if (konamiPos < konami.length) return;
    konamiPos = 0;
    document.body.classList.add("disco");
    setTimeout(function () { document.body.classList.remove("disco"); }, 6000);
    if (typeof spawnConfetti === "function") {
      spawnConfetti(window.innerWidth * 0.2, window.innerHeight, 120);
      spawnConfetti(window.innerWidth * 0.8, window.innerHeight, 120);
    }
    toast("Bonus secret: you know the code. Disco mode. 🪩");
  });

  render();

  window.EGGS = {
    find: find,
    has: function (id) { return found.indexOf(id) !== -1; },
    count: function () { return found.length; },
    total: total,
    allFound: function () { return found.length === total; },
    toast: toast,
    openPanel: openPanel
  };
})();
