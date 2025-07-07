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

// === 本音ボックス機能 ===
(function () {
  // お題（例）
  const honneThemes = [
    'サステナビリティで最近気になることは？',
    'あなたが日常で感じる「もやもや」や「本音」を教えてください',
    '未来の地球や社会について思うことは？'
  ];
  // 現在のお題（1つだけ表示）
  let currentThemeIndex = 0;
  // 本音データ構造: {id, themeIndex, text, age, votes, voters:[]}
  let honneList = [];
  if (localStorage.getItem('honneBoxData')) {
    try {
      honneList = JSON.parse(localStorage.getItem('honneBoxData'));
    } catch (e) {
      honneList = [];
    }
  }
  // 投票履歴（ローカルのみ）
  let votedIds = [];
  if (localStorage.getItem('honneVotedIds')) {
    try {
      votedIds = JSON.parse(localStorage.getItem('honneVotedIds'));
    } catch (e) {
      votedIds = [];
    }
  }
  // UI要素
  const themeArea = document.getElementById('honne-theme-area');
  const form = document.getElementById('honne-form');
  const input = document.getElementById('honne-input');
  const ageInput = document.getElementById('honne-age');
  const listArea = document.getElementById('honne-list');
  const resultArea = document.getElementById('honne-result');

  // お題表示
  function renderTheme() {
    themeArea.innerHTML = `<span>${honneThemes[currentThemeIndex]}</span>`;
  }

  // 本音リスト表示
  function renderList() {
    if (!listArea) return;
    listArea.innerHTML = '';
    // お題ごとにフィルタ
    const filtered = honneList.filter(h => h.themeIndex === currentThemeIndex);
    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'honne-item';
      div.innerHTML = `
        <div class="honne-item-main">
          <span class="honne-item-text">${escapeHTML(item.text)}</span>
          <span class="honne-item-age">${item.age}歳</span>
          <button class="honne-vote-btn${votedIds.includes(item.id) ? ' voted' : ''}" data-id="${item.id}" ${votedIds.includes(item.id) ? 'disabled' : ''}>投票</button>
          <span class="honne-item-votes">${item.votes}票</span>
        </div>
      `;
      div.querySelector('.honne-vote-btn').onclick = function () {
        voteHonne(item.id);
      };
      listArea.appendChild(div);
    });
    renderResult(filtered);
  }

  // 投稿
  form.onsubmit = function (e) {
    e.preventDefault();
    const text = input.value.trim();
    const age = parseInt(ageInput.value, 10);
    if (!text || isNaN(age) || age < 6 || age > 120) {
      alert('本音と年齢（6〜120歳）を正しく入力してください');
      return;
    }
    // XSS対策: 入力値はエスケープして表示
    const newItem = {
      id: 'h' + Date.now() + Math.floor(Math.random()*1000),
      themeIndex: currentThemeIndex,
      text: text,
      age: age,
      votes: 0,
      voters: []
    };
    honneList.push(newItem);
    saveHonne();
    input.value = '';
    ageInput.value = '';
    renderList();
  };

  // 投票
  function voteHonne(id) {
    if (votedIds.includes(id)) return;
    const item = honneList.find(h => h.id === id);
    if (!item) return;
    item.votes++;
    votedIds.push(id);
    saveHonne();
    saveVoted();
    renderList();
  }

  // 結果集計・年齢層分析
  function renderResult(list) {
    if (!resultArea) return;
    if (!list.length) {
      resultArea.innerHTML = '<span style="color:#aaa;">まだ投稿がありません</span>';
      return;
    }
    // 年齢層ごとに集計
    const ageGroups = { '10代':0, '20代':0, '30代':0, '40代':0, '50代以上':0 };
    list.forEach(item => {
      if (item.age < 20) ageGroups['10代']++;
      else if (item.age < 30) ageGroups['20代']++;
      else if (item.age < 40) ageGroups['30代']++;
      else if (item.age < 50) ageGroups['40代']++;
      else ageGroups['50代以上']++;
    });
    let html = '<b>年齢層別投稿数：</b> ';
    html += Object.entries(ageGroups).map(([k,v])=>`${k}:${v}`).join(' ／ ');
    // 得票数トップの本音
    const top = [...list].sort((a,b)=>b.votes-a.votes)[0];
    html += `<br><b>最多得票：</b>「${escapeHTML(top.text)}」 (${top.votes}票)`;
    resultArea.innerHTML = html;
  }

  // 保存
  function saveHonne() {
    localStorage.setItem('honneBoxData', JSON.stringify(honneList));
  }
  function saveVoted() {
    localStorage.setItem('honneVotedIds', JSON.stringify(votedIds));
  }
  // XSS対策
  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, function (c) {
      return {'&':'&amp;','<':'&lt;','>':'&gt;','\'':'&#39;','"':'&quot;'}[c];
    });
  }
  // 初期表示
  if (themeArea) renderTheme();
  if (listArea) renderList();
})(); 