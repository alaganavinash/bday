(function () {
  "use strict";

  const puzzle = SITE.puzzle;

  document.getElementById("puzzleQuestion").textContent = puzzle.question;
  document.title = "A Little Puzzle";

  const main = document.getElementById("puzzleMain");
  const form = document.getElementById("puzzleForm");
  const input = document.getElementById("puzzleInput");
  const feedback = document.getElementById("puzzleFeedback");
  const hintBtn = document.getElementById("hintBtn");
  const hintEl = document.getElementById("puzzleHint");
  const successEl = document.getElementById("puzzleSuccess");

  hintEl.textContent = puzzle.hint;

  hintBtn.addEventListener("click", function () {
    hintEl.hidden = !hintEl.hidden;
    hintBtn.textContent = hintEl.hidden ? "Need a hint?" : "Hide hint";
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (Number(input.value) === puzzle.answer) {
      // .puzzle sets display:flex, which beats the UA [hidden] rule at equal
      // specificity, so the `hidden` attribute alone won't actually hide it.
      main.style.display = "none";

      document.getElementById("successNumber").textContent = puzzle.answer;
      document.getElementById("successLabel").textContent = puzzle.successLabel;
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
    } else {
      feedback.textContent = puzzle.wrongMessage;
      feedback.hidden = false;
      input.focus();
      input.select();
    }
  });
})();
