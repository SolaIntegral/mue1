// 現在のページのパスを取得
const path = location.pathname.split('/').pop();

const navMap = {
  'about.html': 'nav-about',
  'activity.html': 'nav-activity',
  'partner.html': 'nav-partner',
  'support.html': 'nav-support',
  'index.html': 'nav-about', // index.htmlはabout.html扱い
  '': 'nav-about', // ルートアクセス時
};

const activeId = navMap[path];
if (activeId) {
  const el = document.getElementById(activeId);
  if (el) el.classList.add('active');
} 