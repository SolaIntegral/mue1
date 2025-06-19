// 身近なサステナビリティ共有機能
// 投稿一覧・詳細モーダル・新規投稿フォーム・いいね・画像プレビュー

document.addEventListener('DOMContentLoaded', function () {
  // 投稿データ（ローカルストレージ優先）
  let posts = [];
  if (localStorage.getItem('sharePosts')) {
    try {
      posts = JSON.parse(localStorage.getItem('sharePosts'));
    } catch (e) {
      posts = [...window.shareData];
    }
  } else {
    posts = [...window.shareData];
  }

  const listEl = document.getElementById('share-list');
  const modalEl = document.getElementById('share-modal');
  const formEl = document.getElementById('share-form');
  const imageInput = document.getElementById('share-image');
  const imagePreview = document.getElementById('share-image-preview');
  const descInput = document.getElementById('share-description');
  const userInput = document.getElementById('share-user');

  // 投稿一覧を描画
  function renderList() {
    listEl.innerHTML = '';
    posts.slice().reverse().forEach(post => {
      const card = document.createElement('div');
      card.className = 'share-card';
      card.innerHTML = `
        <img class="share-card-image" src="${post.image}" alt="投稿画像">
        <div class="share-card-body">
          <div class="share-card-description">${escapeHTML(post.description)}</div>
          <div class="share-card-meta">${escapeHTML(post.user)}・${formatDate(post.date)}</div>
          <div class="share-card-footer">
            <button class="share-like-btn${post.liked ? ' liked' : ''}" data-id="${post.id}">❤️ <span class="share-like-count">${post.likes}</span></button>
          </div>
        </div>
      `;
      card.onclick = (e) => {
        // いいねボタンのクリックはモーダルを開かない
        if (e.target.closest('.share-like-btn')) return;
        openModal(post.id);
      };
      card.querySelector('.share-like-btn').onclick = function (e) {
        e.stopPropagation();
        toggleLike(post.id, this);
      };
      listEl.appendChild(card);
    });
  }

  // モーダル表示
  function openModal(id) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    modalEl.innerHTML = `
      <div class="share-modal-content">
        <button class="share-modal-close-btn" title="閉じる">×</button>
        <img class="share-modal-image" src="${post.image}" alt="投稿画像">
        <div class="share-modal-description">${escapeHTML(post.description)}</div>
        <div class="share-modal-meta">${escapeHTML(post.user)}・${formatDate(post.date)}</div>
        <button class="share-modal-like-btn${post.liked ? ' liked' : ''}" data-id="${post.id}">❤️ <span class="share-modal-like-count">${post.likes}</span></button>
        <div class="share-modal-comments">
          ${post.comments && post.comments.length ? post.comments.map(c => `<div class="share-modal-comment"><b>${escapeHTML(c.user)}</b>：${escapeHTML(c.text)}</div>`).join('') : '<span style="color:#aaa;">コメントはまだありません</span>'}
        </div>
      </div>
    `;
    modalEl.style.display = 'flex';
    modalEl.querySelector('.share-modal-close-btn').onclick = closeModal;
    modalEl.querySelector('.share-modal-like-btn').onclick = function () {
      toggleLike(post.id, this, true);
    };
    modalEl.onclick = function (e) {
      if (e.target === modalEl) closeModal();
    };
  }
  function closeModal() {
    modalEl.style.display = 'none';
    modalEl.innerHTML = '';
  }

  // いいね処理
  function toggleLike(id, btn, isModal) {
    const post = posts.find(p => p.id === id);
    if (!post) return;
    if (!post.liked) {
      post.likes++;
      post.liked = true;
    } else {
      post.likes--;
      post.liked = false;
    }
    savePosts();
    renderList();
    if (isModal) openModal(id);
  }

  // 新規投稿フォーム
  formEl.onsubmit = function (e) {
    e.preventDefault();
    const file = imageInput.files[0];
    const desc = descInput.value.trim();
    const user = userInput.value.trim() || '匿名';
    if (!file || !desc) {
      alert('写真と説明は必須です');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
      const newPost = {
        id: 's' + (Date.now()),
        image: evt.target.result,
        description: desc,
        user: user,
        date: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      posts.push(newPost);
      savePosts();
      renderList();
      formEl.reset();
      imagePreview.innerHTML = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    reader.readAsDataURL(file);
  };

  // 画像プレビュー
  imageInput.onchange = function () {
    const file = this.files[0];
    if (!file) {
      imagePreview.innerHTML = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = function (evt) {
      imagePreview.innerHTML = `<img src="${evt.target.result}" alt="プレビュー">`;
    };
    reader.readAsDataURL(file);
  };

  // 日付整形
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  // HTMLエスケープ
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c];
    });
  }

  // 保存
  function savePosts() {
    localStorage.setItem('sharePosts', JSON.stringify(posts));
  }

  // 初期表示
  renderList();
}); 