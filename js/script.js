(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- Fill in text content from config ----------
  document.getElementById("heroName").textContent = SITE.name;
  document.getElementById("heroTagline").textContent = SITE.tagline;
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
    document.title = "🎉 Happy Birthday, " + SITE.name + "!";

    if (prefersReducedMotion) return;

    document.getElementById("arrivalName").textContent = SITE.name;
    arrivalOverlay.hidden = false;

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        arrivalOverlay.classList.add("in-view");
      });
    });

    if (typeof spawnConfetti === "function") {
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
    }

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

  tick();
  const timer = setInterval(tick, 1000);

  // ---------- Celebrate button ----------
  const celebrateBtn = document.getElementById("celebrateBtn");
  celebrateBtn.addEventListener("click", function () {
    const rect = celebrateBtn.getBoundingClientRect();
    spawnConfetti(rect.left + rect.width / 2, rect.top - 10);
  });

  // ---------- Letter: type in on scroll ----------
  const letterBody = document.getElementById("letterBody");
  const letterSign = document.getElementById("letterSign");

  function setLetterSign(text) {
    letterSign.textContent = text + " ";
    const heart = document.createElement("i");
    heart.className = "fa-solid fa-heart";
    letterSign.appendChild(heart);
  }

  function typeWriter(el, text, speed, onDone) {
    let i = 0;
    const cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    el.textContent = "";
    el.appendChild(cursor);

    function step() {
      if (i < text.length) {
        cursor.insertAdjacentText("beforebegin", text.charAt(i));
        i++;
        setTimeout(step, 18 + Math.random() * 18);
      } else {
        cursor.remove();
        if (onDone) onDone();
      }
    }
    step();
  }

  const letterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        letterObserver.unobserve(entry.target);

        if (prefersReducedMotion) {
          letterBody.textContent = SITE.letter.body;
          setLetterSign(SITE.letter.sign);
          letterSign.classList.add("in-view");
          return;
        }

        typeWriter(letterBody, SITE.letter.body, 20, function () {
          setLetterSign(SITE.letter.sign);
          letterSign.classList.add("in-view");
        });
      });
    },
    { threshold: 0.4 }
  );
  letterObserver.observe(letterBody);

  // ---------- Gallery ----------
  const placeholderIcon =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 15l-5-5-4 4-2-2-5 5"/></svg>';

  const galleryGrid = document.getElementById("galleryGrid");
  SITE.photos.forEach(function (photo) {
    const item = document.createElement("div");
    item.className = "gallery__item";

    if (photo.src) {
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.caption || "";
      item.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "gallery__placeholder";
      ph.innerHTML = placeholderIcon;
      item.appendChild(ph);
    }

    const caption = document.createElement("div");
    caption.className = "gallery__caption";
    caption.textContent = photo.caption || "";
    item.appendChild(caption);

    item.addEventListener("click", function () {
      openLightbox(photo);
    });

    galleryGrid.appendChild(item);
  });

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

  // ---------- Scroll reveal ----------
  const revealTargets = document.querySelectorAll(".gallery__item");
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
  revealTargets.forEach(function (el) { revealObserver.observe(el); });
})();
