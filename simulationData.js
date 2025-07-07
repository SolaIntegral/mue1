// 2050年の自分シミュレーション用データ
console.log('=== simulationData.js 読み込み開始 ===');

const simulationCategories = [
  {
    id: 'food',
    name: '食生活',
    questions: [
      {
        text: '肉を食べる頻度は？',
        options: [
          { text: 'ほぼ毎日', score: 2 },
          { text: '週に数回', score: 1 },
          { text: 'ほとんど食べない', score: 0 }
        ]
      },
      {
        text: '地産地消を意識していますか？',
        options: [
          { text: 'あまり意識していない', score: 2 },
          { text: '時々意識する', score: 1 },
          { text: '積極的に意識している', score: 0 }
        ]
      },
      {
        text: '食品ロス対策をしていますか？',
        options: [
          { text: '特にしていない', score: 2 },
          { text: '時々している', score: 1 },
          { text: '積極的にしている', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'mobility',
    name: '移動手段',
    questions: [
      {
        text: '普段の移動手段は？',
        options: [
          { text: '自家用車', score: 2 },
          { text: '公共交通機関', score: 1 },
          { text: '自転車・徒歩', score: 0 }
        ]
      },
      {
        text: '飛行機の利用頻度は？',
        options: [
          { text: '年に数回以上', score: 2 },
          { text: '年に1回程度', score: 1 },
          { text: 'ほとんど利用しない', score: 0 }
        ]
      },
      {
        text: '通勤・通学の距離は？',
        options: [
          { text: '20km以上', score: 2 },
          { text: '5〜20km', score: 1 },
          { text: '5km未満', score: 0 }
        ]
      }
    ]
  },
  {
    id: 'energy',
    name: 'エネルギー・消費行動',
    questions: [
      {
        text: '家庭の電力消費量は？',
        options: [
          { text: '多い（エアコン・家電多用）', score: 2 },
          { text: '平均的', score: 1 },
          { text: '少ない（省エネ家電・節電）', score: 0 }
        ]
      },
      {
        text: '再生可能エネルギーの利用状況は？',
        options: [
          { text: '利用していない', score: 2 },
          { text: '一部利用', score: 1 },
          { text: '積極的に利用', score: 0 }
        ]
      },
      {
        text: 'リサイクルやサステナブル製品の選択は？',
        options: [
          { text: 'あまり意識しない', score: 2 },
          { text: '時々意識する', score: 1 },
          { text: '積極的に選ぶ', score: 0 }
        ]
      }
    ]
  }
];

// スコアによる結果マッピング
const simulationResults = {
  bad: {
    label: '現在の行動が続いた場合',
    avatar: 'avatar_current.png',
    bg: 'bg_bad.jpg',
    co2: 12.0,
    message: '今のライフスタイルを続けると、2050年には環境負荷が高まり、健康や生活の質にも影響が出る可能性があります。'
  },
  good: {
    label: '持続可能な行動に転換した場合',
    avatar: 'avatar_sustainable.png',
    bg: 'bg_good.jpg',
    co2: 6.0,
    message: 'サステナブルな選択を続けることで、2050年も健康で豊かな生活と美しい地球を守ることができます！'
  }
};

console.log('simulationCategories定義完了:', simulationCategories);
console.log('simulationResults定義完了:', simulationResults);
console.log('windowオブジェクトに設定:', typeof window !== 'undefined');
if (typeof window !== 'undefined') {
  window.simulationCategories = simulationCategories;
  window.simulationResults = simulationResults;
  console.log('window.simulationCategories設定完了:', window.simulationCategories);
  console.log('window.simulationResults設定完了:', window.simulationResults);
}
console.log('=== simulationData.js 読み込み完了 ==='); 