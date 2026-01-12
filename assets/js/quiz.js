(() => {
  const quizRoot = document.querySelector("[data-quiz]");
  if (!quizRoot) return;

  const questions = [
    {
      text: "Para iniciarmos a verificação de elegibilidade legal, você tem mais de 18 anos?",
      options: ["Sim", "Não"]
    },
    {
      text: "Você já tentou tirar o porte antes, sozinho ou com auxílio de profissionais como advogados ou despachantes?",
      options: ["Sim", "Não"]
    },
    {
      text: "Sua documentação básica está organizada?",
      options: ["Sim", "Parcialmente", "Não"]
    }
  ];

  const questionEl = quizRoot.querySelector("[data-question]");
  const optionsEl = quizRoot.querySelector("[data-options]");
  const progressText = quizRoot.querySelector("[data-progress-text]");
  const progressBar = quizRoot.querySelector("[data-progress-bar]");
  const progressWrap = quizRoot.querySelector(".quiz-progress");
  const stageStart = quizRoot.querySelector('[data-stage="start"]');
  const stageQuestion = quizRoot.querySelector('[data-stage="question"]');
  const stageAnalyzing = quizRoot.querySelector('[data-stage="analyzing"]');
  const stageResult = quizRoot.querySelector('[data-stage="result"]');
  const liveRegion = quizRoot.querySelector("[data-live]");
  const analysisBar = quizRoot.querySelector(".analysis-bar span");
  const analysisPercent = quizRoot.querySelector("[data-analysis-percent]");
  const revealToggle = document.querySelector("[data-reveal-toggle]");
  const startButton = quizRoot.querySelector("[data-quiz-start]");

  const total = questions.length;
  let currentIndex = 0;
  let analysisTimer = null;
  const ANALYSIS_DURATION_MS = 10000;

  const updateProgress = () => {
    progressText.textContent = `Pergunta ${currentIndex + 1}/${total}`;
    progressBar.style.width = `${((currentIndex + 1) / total) * 100}%`;
    liveRegion.textContent = progressText.textContent;
  };

  const renderQuestion = () => {
    const current = questions[currentIndex];
    questionEl.textContent = current.text;
    optionsEl.innerHTML = "";
    current.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.innerHTML = `<span class="option-check" aria-hidden="true"></span><span class="option-text">${option}</span>`;
      btn.dataset.option = option;
      optionsEl.appendChild(btn);
    });
    updateProgress();
  };

  const setStage = (stage) => {
    if (stageStart) {
      stageStart.hidden = stage !== "start";
    }
    stageQuestion.hidden = stage !== "question";
    stageAnalyzing.hidden = stage !== "analyzing";
    stageResult.hidden = stage !== "result";
    if (progressWrap) {
      progressWrap.hidden = stage === "start";
    }
    if (revealToggle) {
      const isHiddenStage = stage === "analyzing" || stage === "result";
      revealToggle.disabled = isHiddenStage;
      revealToggle.hidden = isHiddenStage;
    }
    document.body.classList.toggle("quiz-busy", stage === "analyzing" || stage === "result");
    document.body.classList.toggle("quiz-active", stage === "question");
  };

  const showResult = () => {
    if (analysisTimer) {
      clearTimeout(analysisTimer);
      analysisTimer = null;
    }
    setStage("result");
    progressText.textContent = "Diagnóstico";
    progressBar.style.width = "100%";
    liveRegion.textContent = "Diagnóstico concluído";
  };

  const startAnalyzing = () => {
    setStage("analyzing");
    if (analysisBar) {
      analysisBar.style.transition = `width ${ANALYSIS_DURATION_MS}ms linear`;
      analysisBar.style.width = "0%";
      requestAnimationFrame(() => {
        analysisBar.style.width = "100%";
      });
    }
    if (analysisPercent) {
      analysisPercent.textContent = "0%";
      let elapsed = 0;
      const interval = setInterval(() => {
        elapsed += 250;
        const progress = Math.min((elapsed / ANALYSIS_DURATION_MS) * 100, 100);
        analysisPercent.textContent = `${Math.round(progress)}%`;
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 250);
    }
    analysisTimer = setTimeout(showResult, ANALYSIS_DURATION_MS);
  };

  if (startButton) {
    startButton.addEventListener("click", () => {
      setStage("question");
      renderQuestion();
    });
  }

  optionsEl.addEventListener("click", (event) => {
    const btn = event.target.closest("button[data-option]");
    if (!btn) return;
    if (currentIndex < total - 1) {
      currentIndex += 1;
      renderQuestion();
    } else {
      startAnalyzing();
    }
  });

  setStage("start");
})();

(() => {
  const toggle = document.querySelector("[data-reveal-toggle]");
  const content = document.querySelector("[data-reveal-content]");
  if (!toggle || !content) return;

  toggle.addEventListener("click", () => {
    content.hidden = false;
    content.scrollIntoView({ behavior: "smooth", block: "start" });
    toggle.remove();
  });
})();
