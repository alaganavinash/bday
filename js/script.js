(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Restart a one-shot CSS animation class, even if it's already applied.
  function replay(el, cls) {
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  function burstFrom(el, count) {
    const r = el.getBoundingClientRect();
    spawnConfetti(r.left + r.width / 2, r.top + r.height / 2, count);
  }

  // ---------- Fill in text content from config ----------
  document.getElementById("heroTagline").textContent = SITE.tagline;
  document.getElementById("huntTotal").textContent = EGGS.total;
  document.title = "Happy Birthday, " + SITE.name;

  // ---------- Countdown ----------
  const target = new Date(SITE.birthdayDate).getTime();
  const countdownEl = document.getElementById("countdown");
  const arrivedEl = document.getElementById("arrivedText");
  const arrivalOverlay = document.getElementById("arrivalOverlay");

  function pad(n) { return String(n).padStart(2, "0"); }

  function celebrateArrival() {
    countdownEl.hidden = true;
    arrivedEl.textContent = "It's finally here. Happy birthday, " + SITE.name + "! 🎉";
    arrivedEl.hidden = false;
    document.querySelector(".hero__eyebrow").textContent = "today is all about";
    document.title = "🎉 Happy Birthday, " + SITE.name + "!";

    if (prefersReducedMotion) return;

    document.getElementById("arrivalName").textContent = SITE.name;
    arrivalOverlay.hidden = false;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        arrivalOverlay.classList.add("in-view");
      });
    });

    let bursts = 0;
    const fire = function () {
      spawnConfetti(window.innerWidth * 0.15, window.innerHeight);
      spawnConfetti(window.innerWidth * 0.85, window.innerHeight);
      spawnConfetti(window.innerWidth / 2, window.innerHeight * 0.2);
      bursts++;
      if (bursts >= 8) clearInterval(poppers);
    };
    fire();
    const poppers = setInterval(fire, 450);

    setTimeout(function () {
      arrivalOverlay.classList.remove("in-view");
      setTimeout(function () { arrivalOverlay.hidden = true; }, 800);
    }, 5000);
  }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      celebrateArrival();
      clearInterval(timer);
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    document.getElementById("cd-days").textContent = pad(days);
    document.getElementById("cd-hours").textContent = pad(hours);
    document.getElementById("cd-mins").textContent = pad(mins);
    document.getElementById("cd-secs").textContent = pad(secs);
  }

  const timer = setInterval(tick, 1000);
  tick();

  // ---------- Celebrate button ----------
  const celebrateBtn = document.getElementById("celebrateBtn");
  celebrateBtn.addEventListener("click", function () {
    const rect = celebrateBtn.getBoundingClientRect();
    spawnConfetti(rect.left + rect.width / 2, rect.top - 10);
  });

  // ---------- Secret: tap the name five times ----------
  const heroName = document.getElementById("heroName");
  heroName.setAttribute("aria-label", SITE.name);
  const nameLetters = Array.from(SITE.name).map(function (ch, i) {
    const span = document.createElement("span");
    span.className = "hero__letter";
    span.textContent = ch;
    span.setAttribute("aria-hidden", "true");
    span.style.setProperty("--i", i);
    heroName.appendChild(span);
    return span;
  });

  let nameTaps = 0;
  let nameTimer;
  heroName.addEventListener("click", function (e) {
    const letter = e.target.closest(".hero__letter") ||
      nameLetters[Math.floor(Math.random() * nameLetters.length)];
    replay(letter, "bounce");

    nameTaps++;
    clearTimeout(nameTimer);
    nameTimer = setTimeout(function () { nameTaps = 0; }, 1200);

    if (nameTaps >= 5) {
      nameTaps = 0;
      replay(heroName, "dance");
      setTimeout(function () { heroName.classList.remove("dance"); }, 2200);
      burstFrom(heroName, 90);
      EGGS.find("name");
    }
  });

  // ---------- Secret: blow out the candles ----------
  const candlesEl = document.getElementById("candles");
  const wishMsg = document.getElementById("wishMsg");
  const relightBtn = document.getElementById("relightBtn");
  const micBtn = document.getElementById("micBtn");
  const micLabel = micBtn.querySelector("span");
  const candles = [];

  for (let i = 0; i < SITE.cake.candles; i++) {
    const candle = document.createElement("button");
    candle.type = "button";
    candle.className = "candle";
    candle.setAttribute("aria-label", "Blow out candle " + (i + 1));
    candle.innerHTML = '<span class="candle__flame"></span><span class="candle__smoke"></span>';
    candle.addEventListener("click", function () { blowOut(candle); });
    candlesEl.appendChild(candle);
    candles.push(candle);
  }

  function litCandles() {
    return candles.filter(function (c) { return !c.classList.contains("out"); });
  }

  function blowOut(candle) {
    if (candle.classList.contains("out")) return;
    candle.classList.add("out");
    candle.setAttribute("aria-label", "Candle blown out");
    if (litCandles().length === 0) wishMade();
  }

  function wishMade() {
    stopMic();
    wishMsg.textContent = SITE.cake.wishMessage;
    wishMsg.classList.add("in-view");
    relightBtn.hidden = false;
    micBtn.hidden = true;
    burstFrom(candlesEl, 120);
    EGGS.find("wish");
  }

  relightBtn.addEventListener("click", function () {
    candles.forEach(function (c, i) {
      c.classList.remove("out");
      c.setAttribute("aria-label", "Blow out candle " + (i + 1));
    });
    wishMsg.classList.remove("in-view");
    relightBtn.hidden = true;
    micBtn.hidden = false;
  });

  // Optional: actually blow into the microphone.
  let micStream = null;
  let micCtx = null;

  function stopMic() {
    if (micStream) micStream.getTracks().forEach(function (t) { t.stop(); });
    if (micCtx) micCtx.close();
    micStream = null;
    micCtx = null;
    micBtn.classList.remove("listening");
    if (!micBtn.disabled) micLabel.textContent = "Blow at your mic";
  }

  function micUnavailable() {
    stopMic();
    micBtn.disabled = true;
    micLabel.textContent = "mic's shy, just tap the flames";
  }

  micBtn.addEventListener("click", function () {
    if (micStream) { stopMic(); return; }
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { micUnavailable(); return; }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
      micStream = stream;
      micCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = micCtx.createAnalyser();
      analyser.fftSize = 512;
      micCtx.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      let loudFrames = 0;
      let lastBlow = 0;

      micBtn.classList.add("listening");
      micLabel.textContent = "listening… blow!";

      (function listen(now) {
        if (!micStream) return;
        analyser.getByteTimeDomainData(samples);
        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
          const v = (samples[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / samples.length);
        loudFrames = rms > 0.12 ? loudFrames + 1 : 0;

        // A sustained gust (not a single click or word) puts out one candle at a time.
        if (loudFrames >= 3 && now - lastBlow > 140) {
          const lit = litCandles();
          if (lit.length) blowOut(lit[Math.floor(Math.random() * lit.length)]);
          lastBlow = now;
        }
        requestAnimationFrame(listen);
      })(0);
    }).catch(micUnavailable);
  });

  // ---------- Secret: the tiny egg by the cake ----------
  const hiddenEgg = document.getElementById("hiddenEgg");
  hiddenEgg.hidden = EGGS.has("hidden");
  hiddenEgg.addEventListener("click", function () {
    hiddenEgg.classList.add("cracked");
    burstFrom(hiddenEgg, 40);
    EGGS.find("hidden");
    setTimeout(function () { hiddenEgg.hidden = true; }, 700);
  });

  // ---------- Gallery: flip cards ----------
  const placeholderIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5-4 4-2-2-5 5"/></svg>';

  function makeFlipCard(front, back, onTap) {
    const card = document.createElement("div");
    card.className = "flip";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.innerHTML =
      '<div class="flip__inner"><div class="flip__face flip__front"></div><div class="flip__face flip__back"></div></div>';
    card.querySelector(".flip__front").appendChild(front);
    card.querySelector(".flip__back").appendChild(back);
    card.addEventListener("click", function (e) { onTap(card, e); });
    card.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onTap(card, e);
      }
    });
    return card;
  }

  function toggleFlip(card) {
    card.classList.toggle("flipped");
  }

  function photoCard(photo) {
    const front = document.createDocumentFragment();
    if (photo.src) {
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption || "";
      if (photo.focus) img.style.objectPosition = photo.focus;
      front.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "gallery__placeholder";
      ph.innerHTML = placeholderIcon;
      front.appendChild(ph);
    }
    const flipHint = document.createElement("span");
    flipHint.className = "flip__hint";
    flipHint.innerHTML = '<i class="fa-solid fa-rotate"></i>';
    front.appendChild(flipHint);

    const back = document.createDocumentFragment();
    const caption = document.createElement("p");
    caption.textContent = photo.caption || "";
    back.appendChild(caption);
    if (photo.src) {
      const view = document.createElement("button");
      view.type = "button";
      view.className = "btn-ghost";
      view.textContent = "View photo";
      view.addEventListener("click", function (e) {
        e.stopPropagation();
        openLightbox(photo);
      });
      back.appendChild(view);
    }
    return makeFlipCard(front, back, toggleFlip);
  }

  // Secret: the "do not open" card takes three taps of pure stubbornness.
  function sealedCard() {
    const front = document.createElement("div");
    front.className = "sealed";
    front.innerHTML =
      '<i class="fa-solid fa-lock"></i><span class="sealed__stamp">do not open</span><span class="sealed__nag"></span>';
    const nag = front.querySelector(".sealed__nag");

    const back = document.createElement("p");
    back.textContent = SITE.sealedPhoto.message;

    const nags = ["I said don't.", "Seriously. Stop."];
    let taps = 0;
    const card = makeFlipCard(front, back, function (c) {
      if (taps < nags.length) {
        nag.textContent = nags[taps];
        taps++;
        replay(c, "shake");
        return;
      }
      toggleFlip(c);
      if (taps === nags.length) {
        taps++;
        nag.textContent = "Fine. You win.";
        burstFrom(c, 80);
        EGGS.find("sealed");
      }
    });
    card.classList.add("flip--sealed");
    return card;
  }

  const galleryGrid = document.getElementById("galleryGrid");
  const sealedAt = Math.min(2, SITE.photos.length);
  SITE.photos.forEach(function (photo, i) {
    if (i === sealedAt) galleryGrid.appendChild(sealedCard());
    galleryGrid.appendChild(photoCard(photo));
  });
  if (sealedAt === SITE.photos.length) galleryGrid.appendChild(sealedCard());

  // ---------- Lightbox ----------
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  function openLightbox(photo) {
    if (!photo.src) return;
    lightboxImg.src = photo.src;
    lightboxImg.alt = photo.caption || "";
    lightboxCaption.textContent = photo.caption || "";
    lightbox.classList.add("open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightboxImg.src = "";
  }

  document.getElementById("lightboxClose").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  // ---------- Secret: scratch card ----------
  document.getElementById("scratchKicker").textContent = SITE.scratch.kicker;
  document.getElementById("scratchMsg").textContent = SITE.scratch.message;

  const scratchCanvas = document.getElementById("scratchCanvas");
  const sctx = scratchCanvas.getContext("2d");
  let scratchDone = false;
  let scratching = false;
  let scratchMoves = 0;
  let scratchRect = null;
  let lastPoint = null;

  function paintScratch() {
    const rect = scratchCanvas.getBoundingClientRect();
    const d = Math.min(window.devicePixelRatio || 1, 2);
    const w = (scratchCanvas.width = Math.round(rect.width * d));
    const h = (scratchCanvas.height = Math.round(rect.height * d));

    sctx.globalCompositeOperation = "source-over";
    const gold = sctx.createLinearGradient(0, 0, w, h);
    gold.addColorStop(0, "#e8c893");
    gold.addColorStop(0.5, "#c7974f");
    gold.addColorStop(1, "#e3b978");
    sctx.fillStyle = gold;
    sctx.fillRect(0, 0, w, h);

    sctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    for (let i = 0; i < 70; i++) {
      sctx.beginPath();
      sctx.arc(Math.random() * w, Math.random() * h, (0.6 + Math.random() * 1.6) * d, 0, Math.PI * 2);
      sctx.fill();
    }

    sctx.fillStyle = "rgba(125, 58, 79, 0.85)";
    sctx.textAlign = "center";
    sctx.textBaseline = "middle";
    sctx.font = "italic 500 " + 26 * d + "px 'Playfair Display', Georgia, serif";
    sctx.fillText(SITE.scratch.label + " ✨", w / 2, h / 2);
  }

  function canvasPoint(e) {
    return {
      x: (e.clientX - scratchRect.left) * (scratchCanvas.width / scratchRect.width),
      y: (e.clientY - scratchRect.top) * (scratchCanvas.height / scratchRect.height)
    };
  }

  function scratchLine(a, b) {
    sctx.globalCompositeOperation = "destination-out";
    sctx.lineWidth = 42 * (scratchCanvas.width / scratchRect.width);
    sctx.lineCap = "round";
    sctx.lineJoin = "round";
    sctx.beginPath();
    sctx.moveTo(a.x, a.y);
    sctx.lineTo(b.x + 0.01, b.y);
    sctx.stroke();
    scratchMoves++;
    if (scratchMoves % 12 === 0) checkScratch();
  }

  function checkScratch() {
    if (scratchDone) return;
    const data = sctx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height).data;
    let cleared = 0;
    let sampled = 0;
    for (let i = 3; i < data.length; i += 4 * 23) {
      sampled++;
      if (data[i] === 0) cleared++;
    }
    if (cleared / sampled > 0.5) {
      scratchDone = true;
      scratchCanvas.classList.add("done");
      burstFrom(scratchCanvas, 100);
      EGGS.find("scratch");
    }
  }

  scratchCanvas.addEventListener("pointerdown", function (e) {
    if (scratchDone) return;
    scratching = true;
    scratchRect = scratchCanvas.getBoundingClientRect();
    scratchCanvas.setPointerCapture(e.pointerId);
    lastPoint = canvasPoint(e);
    scratchLine(lastPoint, lastPoint);
  });
  scratchCanvas.addEventListener("pointermove", function (e) {
    if (!scratching) return;
    const p = canvasPoint(e);
    scratchLine(lastPoint, p);
    lastPoint = p;
  });
  ["pointerup", "pointercancel"].forEach(function (type) {
    scratchCanvas.addEventListener(type, function () {
      if (!scratching) return;
      scratching = false;
      checkScratch();
    });
  });

  paintScratch();
  if (document.fonts) {
    document.fonts.ready.then(function () { if (!scratchMoves) paintScratch(); });
  }

  // ---------- Secret: the vault ----------
  const vault = document.getElementById("vault");
  const vaultDisplay = document.getElementById("vaultDisplay");
  const vaultStatus = document.getElementById("vaultStatus");
  const vaultKeys = document.getElementById("vaultKeys");
  const code = String(SITE.vault.code);
  const wrongLines = ["Nope.", "Not quite.", "Still locked."];
  let entry = "";
  let attempts = 0;

  const slots = Array.from(code).map(function () {
    const slot = document.createElement("span");
    slot.className = "vault__slot";
    vaultDisplay.appendChild(slot);
    return slot;
  });

  function renderEntry() {
    slots.forEach(function (slot, i) {
      slot.textContent = entry[i] || "";
      slot.classList.toggle("filled", i < entry.length);
    });
  }

  function tryCode() {
    if (entry === code) {
      vaultStatus.textContent = "Click.";
      vault.classList.add("unlocking");
      setTimeout(function () {
        document.getElementById("vaultDoor").hidden = true;
        document.getElementById("vaultMessage").textContent = SITE.vault.message;
        document.getElementById("vaultInside").hidden = false;
        vault.classList.add("open");
        burstFrom(vault, 140);
        EGGS.find("vault");
      }, 600);
      return;
    }
    attempts++;
    vaultStatus.textContent = attempts >= 3 ? SITE.vault.hint : wrongLines[attempts - 1];
    replay(vault, "shake");
    entry = "";
    setTimeout(renderEntry, 250);
  }

  function pressKey(key) {
    if (vault.classList.contains("unlocking")) return;
    if (key === "back") {
      entry = entry.slice(0, -1);
    } else if (entry.length < code.length) {
      entry += key;
    }
    renderEntry();
    if (entry.length === code.length) setTimeout(tryCode, 200);
  }

  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "back"].forEach(function (key) {
    if (!key) {
      vaultKeys.appendChild(document.createElement("span"));
      return;
    }
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "vault__key";
    if (key === "back") {
      btn.innerHTML = '<i class="fa-solid fa-delete-left"></i>';
      btn.setAttribute("aria-label", "Delete");
    } else {
      btn.textContent = key;
    }
    btn.addEventListener("click", function () { pressKey(key); });
    vaultKeys.appendChild(btn);
  });
  renderEntry();

  // ---------- Secret: the memory match game ----------
  const matchGrid = document.getElementById("matchGrid");
  const matchStatus = document.getElementById("matchStatus");
  const matchActions = document.getElementById("matchActions");
  const matchPhotos = SITE.match.photos;
  let firstCard = null;
  let matchLocked = false;
  let pairsFound = 0;
  let moves = 0;

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = list[i];
      list[i] = list[j];
      list[j] = tmp;
    }
    return list;
  }

  function updateMatchStatus() {
    matchStatus.textContent = "Moves: " + moves + " · Pairs: " + pairsFound + "/" + matchPhotos.length;
  }

  function dealMatch() {
    firstCard = null;
    matchLocked = false;
    pairsFound = 0;
    moves = 0;
    matchGrid.innerHTML = "";
    matchActions.innerHTML = "";

    shuffle(matchPhotos.concat(matchPhotos)).forEach(function (photo) {
      const card = document.createElement("div");
      card.className = "match-card";
      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.dataset.src = photo.src;
      card.setAttribute("aria-label", "Hidden card");
      card.innerHTML =
        '<div class="match-card__inner">' +
          '<div class="match-card__face match-card__back"><i class="fa-solid fa-heart"></i></div>' +
          '<div class="match-card__face match-card__front"></div>' +
        '</div>';
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = "";
      if (photo.focus) img.style.objectPosition = photo.focus;
      card.querySelector(".match-card__front").appendChild(img);
      card.addEventListener("click", function () { flipMatch(card); });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          flipMatch(card);
        }
      });
      matchGrid.appendChild(card);
    });
    updateMatchStatus();
  }

  function flipMatch(card) {
    if (matchLocked || card === firstCard || card.classList.contains("matched")) return;
    card.classList.add("flipped");
    card.setAttribute("aria-label", "Photo card");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    moves++;
    const a = firstCard;
    firstCard = null;

    if (a.dataset.src === card.dataset.src) {
      a.classList.add("matched");
      card.classList.add("matched");
      pairsFound++;
      updateMatchStatus();
      burstFrom(card, 24);
      if (pairsFound === matchPhotos.length) setTimeout(winMatch, 500);
      return;
    }

    updateMatchStatus();
    matchLocked = true;
    setTimeout(function () {
      a.classList.remove("flipped");
      card.classList.remove("flipped");
      a.setAttribute("aria-label", "Hidden card");
      card.setAttribute("aria-label", "Hidden card");
      matchLocked = false;
    }, 850);
  }

  function winMatch() {
    matchStatus.textContent = SITE.match.winMessage + " (" + moves + " moves)";
    const again = document.createElement("button");
    again.type = "button";
    again.className = "btn-ghost";
    again.innerHTML = '<i class="fa-solid fa-shuffle"></i> Shuffle and play again';
    again.addEventListener("click", dealMatch);
    matchActions.appendChild(again);
    burstFrom(matchGrid, 160);
    EGGS.find("match");
  }

  dealMatch();

  // ---------- The sealed letter ----------
  const envelope = document.getElementById("envelope");
  const seal = document.getElementById("seal");
  const sealCount = document.getElementById("sealCount");
  const sealRing = document.getElementById("sealRing");
  const envelopeNote = document.getElementById("envelopeNote");
  const letterAgain = document.getElementById("letterAgain");
  const ringLength = 2 * Math.PI * 46;
  sealRing.style.strokeDasharray = ringLength;

  function updateSeal() {
    const n = EGGS.count();
    const left = EGGS.total - n;
    sealRing.style.strokeDashoffset = ringLength * (1 - n / EGGS.total);
    envelope.classList.toggle("ready", left === 0);
    if (left === 0) {
      sealCount.textContent = "open";
      seal.setAttribute("aria-label", "Open your letter");
      envelopeNote.textContent = "The seal is broken. Tap it to open your letter.";
    } else {
      sealCount.textContent = n + "/" + EGGS.total;
      seal.setAttribute("aria-label", "Sealed: " + n + " of " + EGGS.total + " secrets found");
      envelopeNote.textContent = left + (left === 1 ? " secret" : " secrets") +
        " left to find before this opens. Stuck? Peek in the basket up top.";
    }
  }
  document.addEventListener("eggs:change", updateSeal);
  updateSeal();

  seal.addEventListener("click", function (e) {
    if (!EGGS.allFound()) {
      replay(seal, "wiggle");
      e.stopPropagation();
      EGGS.openPanel();
      return;
    }
    if (envelope.classList.contains("opened")) return;
    envelope.classList.add("opened");
    envelopeNote.hidden = true;
    burstFrom(seal, 160);
    setTimeout(function () {
      envelope.hidden = true;
      letterAgain.hidden = false;
      openLetter();
    }, 900);
  });

  letterAgain.addEventListener("click", openLetter);

  // ---------- Letter popup ----------
  const letterModal = document.getElementById("letterModal");
  const letterBody = document.getElementById("letterBody");
  const letterSign = document.getElementById("letterSign");
  const letterClose = document.getElementById("letterClose");

  // Torn paper: a jagged clip-path, rough along the top and bottom and
  // gentler down the sides. Regenerated per visit so no two tears match.
  function tornEdge() {
    const jag = function (max) { return (Math.random() * max).toFixed(1) + "px"; };
    const pts = [];
    for (let x = 0; x <= 100; x += 1.5) pts.push(x + "% " + jag(9));
    for (let y = 0; y <= 100; y += 2.5) pts.push("calc(100% - " + jag(4) + ") " + y + "%");
    for (let x = 100; x >= 0; x -= 1.5) pts.push(x + "% calc(100% - " + jag(9) + ")");
    for (let y = 100; y >= 0; y -= 2.5) pts.push(jag(4) + " " + y + "%");
    return "polygon(" + pts.join(", ") + ")";
  }
  document.getElementById("letterPaper").style.clipPath = tornEdge();

  // Paragraphs are separated by blank lines; **text** becomes bold.
  document.getElementById("letterTitle").textContent = SITE.letter.title;
  SITE.letter.body.trim().split(/\n\s*\n/).forEach(function (para) {
    const p = document.createElement("p");
    para.split(/\*\*(.+?)\*\*/).forEach(function (part, i) {
      if (!part) return;
      if (i % 2) {
        const strong = document.createElement("strong");
        strong.textContent = part;
        p.appendChild(strong);
      } else {
        p.appendChild(document.createTextNode(part));
      }
    });
    letterBody.appendChild(p);
  });
  letterSign.textContent = SITE.letter.sign + " ";
  const signHeart = document.createElement("i");
  signHeart.className = "fa-solid fa-heart";
  letterSign.appendChild(signHeart);

  function openLetter() {
    letterModal.hidden = false;
    letterModal.querySelector(".letter-modal__paper").scrollTop = 0;
    document.body.classList.add("modal-open");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { letterModal.classList.add("open"); });
    });
    letterClose.focus({ preventScroll: true });
  }

  function closeLetter() {
    if (letterModal.hidden) return;
    letterModal.classList.remove("open");
    document.body.classList.remove("modal-open");
    setTimeout(function () { letterModal.hidden = true; }, 350);
  }

  letterClose.addEventListener("click", closeLetter);
  letterModal.addEventListener("click", function (e) {
    if (e.target === letterModal) closeLetter();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLetter();
  });

  // ---------- Scroll reveal ----------
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".flip, .reveal").forEach(function (el) { revealObserver.observe(el); });
})();
