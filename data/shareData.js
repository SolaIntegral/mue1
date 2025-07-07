// 身近なサステナビリティ共有サンプルデータ
const shareData = [
  {
    id: 's1',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    description: '自宅のベランダでミニトマトを育てています。無農薩で安心！',
    user: 'みどり',
    date: '2024-06-01T10:30:00',
    likes: 3,
    comments: [
      { user: 'エコ太郎', text: '素敵な取り組みですね！' },
      { user: '花子', text: '私もやってみたいです。' }
    ]
  },
  {
    id: 's2',
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    description: 'マイボトルを持ち歩いて、ペットボトルごみを減らしています。',
    user: 'サスケ',
    date: '2024-06-02T08:15:00',
    likes: 5,
    comments: [
      { user: 'みどり', text: '私もマイボトル派です！' }
    ]
  },
  {
    id: 's3',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    description: '近所の公園でごみ拾いボランティアに参加しました。',
    user: 'クリーンマン',
    date: '2024-06-03T14:00:00',
    likes: 2,
    comments: []
  },
  {
    id: 's4',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    description: '古着をリメイクしてエコバッグを作りました。',
    user: 'リメイク女子',
    date: '2024-06-04T17:45:00',
    likes: 4,
    comments: [
      { user: 'サスケ', text: 'デザインが気になります！' }
    ]
  },
  {
    id: 's5',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    description: '家庭菜園で採れた野菜を近所におすそ分けしました。',
    user: 'やさいママ',
    date: '2024-06-05T09:20:00',
    likes: 6,
    comments: [
      { user: 'クリーンマン', text: '地域のつながりが素敵です！' }
    ]
  }
];

// 本音ボックス用データ
const honneBoxData = {
  theme: '「サステナビリティについて、今思うことを教えてください」',
  posts: [
    // { id, text, age, votes }
    { id: 'h1', text: 'もっと身近な活動が増えてほしい', age: 22, votes: 3 },
    { id: 'h2', text: '学校でもっと学びたい', age: 16, votes: 2 },
    { id: 'h3', text: '大人も子どもも一緒に考えたい', age: 35, votes: 1 }
  ]
};
window.honneBoxData = honneBoxData; 