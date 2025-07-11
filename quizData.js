// サステナクイズ用データ（仮データ）
console.log('=== quizData.js 読み込み開始 ===');

const quizData = [
  {
    question: 'サステナビリティの「3R」に含まれるものはどれ？',
    choices: ['リデュース', 'リフレッシュ', 'リセット', 'リラックス'],
    answer: 0,
    explanation: '3Rはリデュース（削減）、リユース（再利用）、リサイクル（再資源化）です。'
  },
  {
    question: '地球温暖化の主な原因は？',
    choices: ['酸素', '二酸化炭素', '水素', 'ヘリウム'],
    answer: 1,
    explanation: '二酸化炭素（CO2）などの温室効果ガスが主な原因です。'
  },
  {
    question: 'SDGsの目標数はいくつ？',
    choices: ['10', '12', '15', '17'],
    answer: 3,
    explanation: 'SDGs（持続可能な開発目標）は全部で17個あります。'
  },
  {
    question: 'プラスチックごみが最も多く流れ着く場所は？',
    choices: ['山', '川', '海', '砂漠'],
    answer: 2,
    explanation: 'プラスチックごみは最終的に多くが海に流れ着きます。'
  },
  {
    question: '「2050年カーボンニュートラル」とは何を目指す？',
    choices: ['温室効果ガス排出ゼロ', '人口ゼロ', '森林ゼロ', '水資源ゼロ'],
    answer: 0,
    explanation: '2050年までに温室効果ガス排出量を実質ゼロにすることを目指します。'
  }
];

console.log('quizData定義完了:', quizData);
console.log('quizDataの長さ:', quizData.length);
console.log('window.quizDataに設定:', typeof window !== 'undefined');
if (typeof window !== 'undefined') {
  window.quizData = quizData;
  console.log('window.quizData設定完了:', window.quizData);
}
console.log('=== quizData.js 読み込み完了 ==='); 