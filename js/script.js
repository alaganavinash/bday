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

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      countdownEl.hidden = true;
      arrivedEl.hidden = false;
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
})();
