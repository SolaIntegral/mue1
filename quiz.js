// サステナクイズ画面のロジック（quiz.html専用）
document.addEventListener('DOMContentLoaded', function () {
  if (!window.quizData || !Array.isArray(window.quizData) || window.quizData.length === 0) {
    document.getElementById('quiz-question').textContent = 'クイズデータが読み込まれていません。';
    return;
  }

  const questionEl = document.getElementById('quiz-question');
  const choicesEl = document.getElementById('quiz-choices');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next-btn');
  const resultEl = document.getElementById('quiz-result');
  const actionsEl = document.getElementById('quiz-actions');
  const currentEl = document.getElementById('quiz-current');
  const totalEl = document.getElementById('quiz-total');

  let current = 0;
  let correctCount = 0;
  let answered = false;

  totalEl.textContent = quizData.length;

  function showQuestion() {
    answered = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz-feedback';
    nextBtn.style.display = 'none';
    resultEl.style.display = 'none';
    actionsEl.style.display = 'none';
    currentEl.textContent = current + 1;
    const q = quizData[current];
    questionEl.textContent = q.question;
    // 選択肢生成
    choicesEl.innerHTML = '';
    q.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-choice-btn';
      btn.textContent = choice;
      btn.onclick = () => selectAnswer(idx, btn);
      choicesEl.appendChild(btn);
    });
  }

  function selectAnswer(idx, btn) {
    if (answered) return;
    answered = true;
    const q = quizData[current];
    // 全ボタンをdisabledに
    Array.from(choicesEl.children).forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add('correct');
      if (i === idx && idx !== q.answer) b.classList.add('incorrect');
    });
    if (idx === q.answer) {
      correctCount++;
      feedbackEl.innerHTML = '正解！<span class="explanation">' + q.explanation + '</span>';
      feedbackEl.className = 'quiz-feedback correct';
    } else {
      feedbackEl.innerHTML = '不正解…<span class="explanation">正解：' + q.choices[q.answer] + '<br>' + q.explanation + '</span>';
      feedbackEl.className = 'quiz-feedback incorrect';
    }
    nextBtn.style.display = 'inline-block';
    if (current === quizData.length - 1) {
      nextBtn.textContent = '結果を見る';
    } else {
      nextBtn.textContent = '次の問題へ';
    }
  }

  nextBtn.onclick = function () {
    if (current < quizData.length - 1) {
      current++;
      showQuestion();
    } else {
      showResult();
    }
  };

  function showResult() {
    questionEl.textContent = '';
    choicesEl.innerHTML = '';
    feedbackEl.textContent = '';
    nextBtn.style.display = 'none';
    resultEl.style.display = 'block';
    actionsEl.style.display = 'flex';
    resultEl.innerHTML = `あなたの正解数：<strong>${correctCount} / ${quizData.length}</strong><br>` +
      getResultMessage(correctCount, quizData.length);
    actionsEl.innerHTML =
      '<a href="quiz.html">もう一度挑戦する</a>' +
      '<a href="future.html">未来の自分シミュレーションを試す</a>' +
      '<a href="share.html">身近なサステナビリティ共有へ</a>';
  }

  function getResultMessage(score, total) {
    if (score === total) return 'サステナビリティマスター！素晴らしい知識です。';
    if (score >= total - 1) return 'あと少しで満点！よく頑張りました。';
    if (score >= Math.floor(total / 2)) return 'なかなかの健闘です。もっと学んでみましょう！';
    return 'これからがスタート！サステナビリティについて一緒に学びましょう。';
  }

  // 初期表示
  showQuestion();
}); 