// Shared canvas background (falling petals) + confetti burst, used by every page.
// Exposes window.spawnConfetti(originX, originY) for page-specific scripts to trigger.
(function () {
  "use strict";

  const canvas = document.getElementById("petals");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d");
  let petals = [];
  let confettiPieces = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resize() {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function makePetal() {
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * -window.innerHeight,
      size: 6 + Math.random() * 8,
      speed: 0.4 + Math.random() * 0.8,
      drift: Math.random() * 1 - 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      hue: Math.random() > 0.5 ? "#e7b7c3" : "#e8c893"
    };
  }

  function initPetals() {
    const count = window.innerWidth < 640 ? 14 : 24;
    petals = Array.from({ length: count }, makePetal);
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.hue;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  const confettiColors = ["#a8576e", "#c7974f", "#7d3a4f", "#e7b7c3", "#f2d9a8"];

  function spawnConfetti(originX, originY) {
    const x = typeof originX === "number" ? originX : window.innerWidth / 2;
    const y = typeof originY === "number" ? originY : 0;
    for (let i = 0; i < 160; i++) {
      // Bias angles upward (into the top half of the circle) so the burst
      // reads as exploding above the origin point, not spilling below it.
      const angle = Math.PI + Math.random() * Math.PI;
      const speed = 3 + Math.random() * 7;
      confettiPieces.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 5 + Math.random() * 5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.35,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        life: 0,
        maxLife: 80 + Math.random() * 40
      });
    }
  }
  window.spawnConfetti = spawnConfetti;

  function drawConfetti(p) {
    const fade = Math.max(0, 1 - p.life / p.maxLife);
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.fillStyle = p.color;
    ctx.globalAlpha = fade;
    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    if (!prefersReducedMotion) {
      petals.forEach(function (p) {
        p.y += p.speed;
        p.x += p.drift;
        p.rotation += p.rotSpeed;
        if (p.y > window.innerHeight + 20) {
          p.y = -20;
          p.x = Math.random() * window.innerWidth;
        }
        drawPetal(p);
      });
    }

    if (confettiPieces.length) {
      confettiPieces = confettiPieces.filter(function (p) {
        p.vy = Math.min(p.vy + 0.1, 8);
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        p.life++;
        if (p.life < p.maxLife && p.y < window.innerHeight + 40) {
          drawConfetti(p);
          return true;
        }
        return false;
      });
    }

    requestAnimationFrame(animate);
  }

  resize();
  if (!prefersReducedMotion) initPetals();
  animate();
  window.addEventListener("resize", function () {
    resize();
    if (!prefersReducedMotion) initPetals();
  });
})();
