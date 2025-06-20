(function () {
  console.log('=== クイズスクリプト開始 ===');
  
  // サステナクイズ画面のロジック（quiz.html専用）
  console.log('quizDataの確認:', window.quizData);
  console.log('quizDataの型:', typeof window.quizData);
  console.log('quizDataが配列か:', Array.isArray(window.quizData));
  console.log('quizDataの長さ:', window.quizData ? window.quizData.length : 'undefined');
  
  if (!window.quizData || !Array.isArray(window.quizData) || window.quizData.length === 0) {
    console.error('クイズデータが正しく読み込まれていません');
    const questionEl = document.getElementById('quiz-question');
    if (questionEl) {
      questionEl.textContent = 'クイズデータが読み込まれていません。';
    } else {
      console.error('quiz-question要素が見つかりません');
    }
    return;
  }

  console.log('DOM要素の取得を開始');
  const questionEl = document.getElementById('quiz-question');
  const choicesEl = document.getElementById('quiz-choices');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('quiz-next-btn');
  const resultEl = document.getElementById('quiz-result');
  const actionsEl = document.getElementById('quiz-actions');
  const currentEl = document.getElementById('quiz-current');
  const totalEl = document.getElementById('quiz-total');

  console.log('DOM要素の確認:');
  console.log('- questionEl:', questionEl);
  console.log('- choicesEl:', choicesEl);
  console.log('- feedbackEl:', feedbackEl);
  console.log('- nextBtn:', nextBtn);
  console.log('- resultEl:', resultEl);
  console.log('- actionsEl:', actionsEl);
  console.log('- currentEl:', currentEl);
  console.log('- totalEl:', totalEl);

  // 必要な要素が見つからない場合はエラー
  if (!questionEl || !choicesEl || !feedbackEl || !nextBtn || !resultEl || !actionsEl || !currentEl || !totalEl) {
    console.error('必要なDOM要素が見つかりません');
    return;
  }

  let current = 0;
  let correctCount = 0;
  let answered = false;

  console.log('初期化完了 - クイズ開始');
  totalEl.textContent = quizData.length;

  function showQuestion() {
    console.log('showQuestion() 実行 - 問題番号:', current + 1);
    answered = false;
    feedbackEl.textContent = '';
    feedbackEl.className = 'quiz-feedback';
    nextBtn.style.display = 'none';
    resultEl.style.display = 'none';
    actionsEl.style.display = 'none';
    currentEl.textContent = current + 1;
    const q = quizData[current];
    console.log('現在の問題:', q);
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
    console.log('問題表示完了');
  }

  function selectAnswer(idx, btn) {
    console.log('selectAnswer() 実行 - 選択肢:', idx);
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
      console.log('正解！ 現在の正解数:', correctCount);
    } else {
      feedbackEl.innerHTML = '不正解…<span class="explanation">正解：' + q.choices[q.answer] + '<br>' + q.explanation + '</span>';
      feedbackEl.className = 'quiz-feedback incorrect';
      console.log('不正解… 現在の正解数:', correctCount);
    }
    nextBtn.style.display = 'inline-block';
    if (current === quizData.length - 1) {
      nextBtn.textContent = '結果を見る';
    } else {
      nextBtn.textContent = '次の問題へ';
    }
  }

  nextBtn.onclick = function () {
    console.log('次の問題ボタンクリック - 現在の問題:', current + 1, '/', quizData.length);
    if (current < quizData.length - 1) {
      current++;
      showQuestion();
    } else {
      showResult();
    }
  };

  function showResult() {
    console.log('showResult() 実行 - 最終スコア:', correctCount, '/', quizData.length);
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
  console.log('初期問題表示を開始');
  showQuestion();
  console.log('=== クイズスクリプト初期化完了 ===');
})(); 