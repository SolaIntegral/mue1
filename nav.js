// 現在のページのパスを取得
const path = location.pathname.split('/').pop();

const navMap = {
  'quiz.html': 'nav-quiz',
  'discussion.html': 'nav-discussion',
  'share.html': 'nav-share',
  'future.html': 'nav-future',
  'index.html': 'nav-quiz', // index.htmlはquiz.html扱い
  '': 'nav-quiz', // ルートアクセス時
};

const activeId = navMap[path];
if (activeId) {
  const el = document.getElementById(activeId);
  if (el) el.classList.add('active');
} 