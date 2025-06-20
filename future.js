// 2050年の自分シミュレーション機能
// 質問進行・スコア計算・結果表示・アバター/背景切替・プログレスバー

console.log('=== future.js 読み込み開始 ===');

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded発火 - future.js');
  console.log('simulationCategoriesの確認:', window.simulationCategories);
  console.log('simulationResultsの確認:', window.simulationResults);
  console.log('simulationCategoriesの型:', typeof window.simulationCategories);
  console.log('simulationResultsの型:', typeof window.simulationResults);
  
  if (!window.simulationCategories || !window.simulationResults) {
    console.error('simulationCategoriesまたはsimulationResultsが読み込まれていません');
    return;
  }

  console.log('DOM要素の取得を開始');
  const questionArea = document.getElementById('sim-question-area');
  const resultArea = document.getElementById('sim-result-area');
  const progressBar = document.getElementById('sim-progress');

  console.log('DOM要素の確認:');
  console.log('- questionArea:', questionArea);
  console.log('- resultArea:', resultArea);
  console.log('- progressBar:', progressBar);

  if (!questionArea || !resultArea || !progressBar) {
    console.error('必要なDOM要素が見つかりません');
    return;
  }

  // 質問データ展開
  let questions = [];
  simulationCategories.forEach(cat => {
    cat.questions.forEach(q => {
      questions.push({
        category: cat.name,
        text: q.text,
        options: q.options
      });
    });
  });
  const totalQuestions = questions.length;
  console.log('質問データ展開完了 - 総質問数:', totalQuestions);
  let current = 0;
  let answers = [];

  function renderQuestion() {
    console.log('renderQuestion() 実行 - 現在の問題:', current + 1, '/', totalQuestions);
    resultArea.style.display = 'none';
    questionArea.style.display = 'flex';
    const q = questions[current];
    let html = '';
    html += `<div class="sim-category-title">${q.category}</div>`;
    html += `<div class="sim-question-text">${q.text}</div>`;
    html += '<form class="sim-options">';
    q.options.forEach((opt, idx) => {
      const checked = (answers[current] === idx) ? 'checked' : '';
      html += `
        <input type="radio" name="sim-q" id="sim-q${idx}" class="sim-option-input" value="${idx}" ${checked}>
        <label for="sim-q${idx}" class="sim-option-label">${opt.text}</label>
      `;
    });
    html += '</form>';
    html += `<button class="sim-next-btn" id="sim-next-btn" disabled>次へ</button>`;
    questionArea.innerHTML = html;
    // プログレスバー
    progressBar.style.width = `${((current) / totalQuestions) * 100}%`;
    // 選択肢選択時
    const radios = questionArea.querySelectorAll('.sim-option-input');
    const nextBtn = document.getElementById('sim-next-btn');
    radios.forEach(radio => {
      radio.onchange = function () {
        console.log('選択肢選択:', radio.value);
        nextBtn.disabled = false;
      };
    });
    nextBtn.onclick = function () {
      const selected = Array.from(radios).find(r => r.checked);
      if (!selected) return;
      answers[current] = parseInt(selected.value);
      console.log('次へボタンクリック - 回答:', answers[current]);
      if (current < totalQuestions - 1) {
        current++;
        renderQuestion();
      } else {
        showResult();
      }
    };
    // すでに選択済みならボタン有効化
    if (answers[current] !== undefined) nextBtn.disabled = false;
    console.log('問題表示完了');
  }

  function showResult() {
    console.log('showResult() 実行');
    questionArea.style.display = 'none';
    resultArea.style.display = 'flex';
    progressBar.style.width = '100%';
    // スコア計算
    let totalScore = 0;
    questions.forEach((q, i) => {
      const idx = answers[i];
      if (idx !== undefined) totalScore += q.options[idx].score;
    });
    console.log('スコア計算完了 - 総スコア:', totalScore);
    // シナリオ分岐
    const bad = simulationResults.bad;
    const good = simulationResults.good;
    // スコアが高いほど環境負荷大
    const maxScore = totalQuestions * 2;
    const minScore = 0;
    // 線形補間でCO2値を計算
    const co2Current = bad.co2 - ((bad.co2 - good.co2) * (maxScore - totalScore) / (maxScore - minScore));
    // アバター・背景は閾値で分岐
    const isSustainable = totalScore <= totalQuestions;
    console.log('結果計算完了 - CO2:', co2Current, 'サステナブル:', isSustainable);
    // 結果HTML
    let html = '';
    html += `<div class="sim-result-title">あなたの2050年の未来</div>`;
    html += `<div class="sim-result-compare">
      <div class="sim-result-compare-block">
        <div class="sim-result-compare-title">${bad.label}</div>
        <img class="sim-result-compare-avatar" src="${bad.avatar}" alt="現在の行動アバター">
        <img class="sim-result-compare-bg" src="${bad.bg}" alt="現在の行動背景">
        <div class="sim-result-compare-co2">CO₂排出量: ${bad.co2.toFixed(1)} t/年</div>
        <div class="sim-result-compare-message">${bad.message}</div>
      </div>
      <div class="sim-result-compare-block">
        <div class="sim-result-compare-title">${good.label}</div>
        <img class="sim-result-compare-avatar" src="${good.avatar}" alt="サステナブルアバター">
        <img class="sim-result-compare-bg" src="${good.bg}" alt="サステナブル背景">
        <div class="sim-result-compare-co2">CO₂排出量: ${good.co2.toFixed(1)} t/年</div>
        <div class="sim-result-compare-message">${good.message}</div>
      </div>
    </div>`;
    html += `<div class="sim-result-co2">あなたの推定CO₂排出量: <b>${co2Current.toFixed(1)} t/年</b></div>`;
    html += `<div class="sim-result-message">${isSustainable ? 'あなたの選択はサステナブルな未来につながります！' : 'よりサステナブルな選択で未来を変えましょう！'}</div>`;
    html += `<div class="sim-result-actions">
      <button id="sim-retry-btn">もう一度シミュレーション</button>
      <a href="quiz.html">サステナクイズに挑戦</a>
      <a href="share.html">みんなの取り組みを見る</a>
    </div>`;
    resultArea.innerHTML = html;
    document.getElementById('sim-retry-btn').onclick = function () {
      console.log('再挑戦ボタンクリック');
      current = 0;
      answers = [];
      renderQuestion();
    };
    console.log('結果表示完了');
  }

  // 初期表示
  console.log('初期問題表示を開始');
  renderQuestion();
  console.log('=== future.js 初期化完了 ===');
}); 