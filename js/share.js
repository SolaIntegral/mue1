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

  // --- 本音ボックス機能 ---
  // 本音ボックスデータの初期化
  let honneData = null;
  if (localStorage.getItem('honneBoxData')) {
    try {
      honneData = JSON.parse(localStorage.getItem('honneBoxData'));
    } catch (e) {
      honneData = window.honneBoxData;
    }
  } else {
    honneData = window.honneBoxData;
  }

  const themeArea = document.getElementById('honne-theme-area');
  const honneForm = document.getElementById('honne-form');
  const honneInput = document.getElementById('honne-input');
  const honneAge = document.getElementById('honne-age');
  const honneList = document.getElementById('honne-list');
  const honneResult = document.getElementById('honne-result');

  // お題表示
  function renderTheme() {
    themeArea.textContent = honneData.theme;
  }

  // 本音リスト表示
  function renderHonneList() {
    honneList.innerHTML = '';
    honneData.posts.slice().reverse().forEach(post => {
      const item = document.createElement('div');
      item.className = 'honne-item';
      item.innerHTML = `
        <div class="honne-item-content">${escapeHTML(post.text)}</div>
        <div class="honne-item-meta">年齢: ${post.age}</div>
        <button class="honne-vote-btn" data-id="${post.id}">44d 投票 <span>${post.votes}</span></button>
      `;
      // 投票ボタンの状態管理
      if (getVoted(post.id)) {
        item.querySelector('.honne-vote-btn').classList.add('voted');
        item.querySelector('.honne-vote-btn').disabled = true;
      }
      item.querySelector('.honne-vote-btn').onclick = function () {
        voteHonne(post.id);
      };
      honneList.appendChild(item);
    });
  }

  // 本音投稿
  honneForm.onsubmit = function (e) {
    e.preventDefault();
    const text = honneInput.value.trim();
    const age = parseInt(honneAge.value, 10);
    if (!text || isNaN(age) || age < 6 || age > 120) {
      alert('本音と年齢（6〜120歳）を正しく入力してください');
      return;
    }
    // セキュリティ: XSS対策
    const safeText = escapeHTML(text);
    const newPost = {
      id: 'h' + Date.now(),
      text: safeText,
      age: age,
      votes: 0
    };
    honneData.posts.push(newPost);
    saveHonne();
    renderHonneList();
    renderResult();
    honneForm.reset();
  };

  // 投票
  function voteHonne(id) {
    const post = honneData.posts.find(p => p.id === id);
    if (!post) return;
    if (getVoted(id)) return;
    post.votes++;
    setVoted(id);
    saveHonne();
    renderHonneList();
    renderResult();
  }

  // 投票済み管理（localStorage, 端末ごと）
  function getVoted(id) {
    const voted = JSON.parse(localStorage.getItem('honneVoted') || '{}');
    return !!voted[id];
  }
  function setVoted(id) {
    const voted = JSON.parse(localStorage.getItem('honneVoted') || '{}');
    voted[id] = true;
    localStorage.setItem('honneVoted', JSON.stringify(voted));
  }

  // 集計・年齢層分析
  function renderResult() {
    if (!honneData.posts.length) {
      honneResult.innerHTML = '';
      return;
    }
    // 得票数順
    const sorted = honneData.posts.slice().sort((a,b)=>b.votes-a.votes);
    let html = '<b>投票結果（得票数順）</b><ul style="margin:8px 0 0 18px;">';
    sorted.forEach(p => {
      html += `<li>${escapeHTML(p.text)}（年齢: ${p.age}）… <b>${p.votes}票</b></li>`;
    });
    html += '</ul>';
    // 年齢層分析
    const ageGroups = { '10代':0, '20代':0, '30代':0, '40代':0, '50代以上':0 };
    honneData.posts.forEach(p => {
      if (p.age < 20) ageGroups['10代'] += p.votes;
      else if (p.age < 30) ageGroups['20代'] += p.votes;
      else if (p.age < 40) ageGroups['30代'] += p.votes;
      else if (p.age < 50) ageGroups['40代'] += p.votes;
      else ageGroups['50代以上'] += p.votes;
    });
    html += '<div style="margin-top:10px;font-size:0.98em;">年齢層別投票傾向：';
    Object.entries(ageGroups).forEach(([k,v])=>{
      html += ` <span style="margin-right:8px;">${k}: <b>${v}</b>票</span>`;
    });
    html += '</div>';
    honneResult.innerHTML = html;
  }

  // 保存
  function saveHonne() {
    localStorage.setItem('honneBoxData', JSON.stringify(honneData));
  }

  // XSS対策
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c];
    });
  }

  // 初期表示
  renderList();
  renderTheme();
  renderHonneList();
  renderResult();
}); 