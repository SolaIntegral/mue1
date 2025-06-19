// ドロップダウンのクリック動作（スマホ対応）
document.querySelectorAll('.tte-dropdown-btn').forEach(btn => {
  btn.addEventListener('click', function(e) {
    // PCではhoverで開くので、スマホのみtoggle
    if (window.innerWidth <= 900) {
      e.preventDefault();
      const content = this.nextElementSibling;
      const isOpen = content.style.display === 'flex';
      document.querySelectorAll('.tte-dropdown-content').forEach(c => c.style.display = 'none');
      content.style.display = isOpen ? 'none' : 'flex';
    }
  });
});

// 画面外クリックでドロップダウンを閉じる（スマホのみ）
document.addEventListener('click', function(e) {
  if (window.innerWidth <= 900) {
    if (!e.target.closest('.tte-dropdown')) {
      document.querySelectorAll('.tte-dropdown-content').forEach(c => c.style.display = 'none');
    }
  }
}); 