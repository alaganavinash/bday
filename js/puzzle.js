(function () {
  "use strict";

  const puzzle = SITE.puzzle;

  document.getElementById("puzzleQuestion").textContent = puzzle.question;
  const whyBtn = document.getElementById("whyBtn");
  whyBtn.textContent = puzzle.buttonLabel;

  const main = document.getElementById("puzzleMain");
  const successEl = document.getElementById("puzzleSuccess");

  whyBtn.addEventListener("click", function () {
    // .puzzle sets display:flex, which beats the UA [hidden] rule at equal
    // specificity, so the `hidden` attribute alone won't actually hide it.
    main.style.display = "none";

    document.getElementById("successIntro").textContent = puzzle.revealIntro;
    document.getElementById("successAnswer").textContent = puzzle.revealAnswer;

    const daysLeft = Math.max(0, Math.floor((new Date(SITE.birthdayDate).getTime() - Date.now()) / 86400000));
    document.getElementById("successDays").textContent = daysLeft + " Days to Go";

    successEl.hidden = false;

    // Two rAFs so the browser commits the "hidden" removal first, then
    // the class toggle actually transitions instead of jumping straight in.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        successEl.classList.add("in-view");
      });
    });

    // Poppers from both bottom corners, fired a few times for a fuller celebration.
    if (typeof spawnConfetti === "function") {
      let bursts = 0;
      const fire = function () {
        spawnConfetti(window.innerWidth * 0.12, window.innerHeight);
        spawnConfetti(window.innerWidth * 0.88, window.innerHeight);
        bursts++;
        if (bursts >= 4) clearInterval(poppers);
      };
      fire();
      const poppers = setInterval(fire, 400);
    }
  });
})();
