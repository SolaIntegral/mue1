// サステナディスカッションまとめ機能
// 一覧と詳細をSPA風に切り替え

console.log('=== discussion.js 読み込み開始 ===');

document.addEventListener('DOMContentLoaded', function () {
  console.log('DOMContentLoaded発火 - discussion.js');
  console.log('discussionDataの確認:', window.discussionData);
  console.log('discussionDataの型:', typeof window.discussionData);
  console.log('discussionDataが配列か:', Array.isArray(window.discussionData));
  console.log('discussionDataの長さ:', window.discussionData ? window.discussionData.length : 'undefined');
  
  if (!window.discussionData) {
    console.error('discussionDataが読み込まれていません');
    return;
  }

  console.log('DOM要素の取得を開始');
  const listView = document.getElementById('discussion-list-view');
  const detailView = document.getElementById('discussion-detail-view');

  console.log('DOM要素の確認:');
  console.log('- listView:', listView);
  console.log('- detailView:', detailView);

  if (!listView || !detailView) {
    console.error('必要なDOM要素が見つかりません');
    return;
  }

  // 一覧表示
  function renderList() {
    console.log('renderList() 実行');
    listView.innerHTML = '';
    detailView.style.display = 'none';
    listView.style.display = 'grid';
    discussionData.forEach((discussion, index) => {
      console.log(`ディスカッション${index + 1}のカード作成:`, discussion.title);
      const card = document.createElement('div');
      card.className = 'discussion-card';
      card.innerHTML = `
        <div class="discussion-card-title">${discussion.title}</div>
        <div class="discussion-card-date">${formatDate(discussion.date)}</div>
        <div class="discussion-card-summary">${discussion.summary.replace(/<[^>]+>/g, '')}</div>
        <div class="discussion-card-topics">${discussion.topics}</div>
      `;
      card.onclick = () => {
        console.log('カードクリック:', discussion.id);
        location.hash = '#' + discussion.id;
      };
      listView.appendChild(card);
    });
    console.log('一覧表示完了');
  }

  // 詳細表示
  function renderDetail(id) {
    console.log('renderDetail() 実行 - ID:', id);
    const discussion = discussionData.find(d => d.id === id);
    if (!discussion) {
      console.error('指定されたIDのディスカッションが見つかりません:', id);
      return renderList();
    }
    console.log('詳細表示するディスカッション:', discussion.title);
    listView.style.display = 'none';
    detailView.style.display = 'block';
    detailView.innerHTML = `
      <button class="discussion-back-btn">← 一覧に戻る</button>
      <div class="discussion-detail-title">${discussion.title}</div>
      <div class="discussion-detail-date">${formatDate(discussion.date)}</div>
      <div class="discussion-detail-participants">${discussion.participants ? '参加者: ' + discussion.participants.join('、') : ''}</div>
      <div class="discussion-detail-purpose">${discussion.purpose}</div>
      <div class="discussion-detail-summary">${discussion.summary}</div>
      <div class="discussion-detail-block">
        <h4>主要な論点</h4>
        <ul class="discussion-detail-list">${discussion.points.map(p => `<li>${p}</li>`).join('')}</ul>
      </div>
      <div class="discussion-detail-block">
        <h4>決定事項</h4>
        <ul class="discussion-detail-list">${discussion.decisions.map(d => `<li>${d}</li>`).join('')}</ul>
      </div>
      ${renderTrends(discussion.trends)}
      <div class="discussion-detail-block">
        <h4>関連リンク</h4>
        <div class="discussion-detail-links">
          ${discussion.links.map(l => `<a class="discussion-detail-link" href="${l.url}" target="_blank" rel="noopener">${l.text}</a>`).join('')}
        </div>
      </div>
    `;
    detailView.querySelector('.discussion-back-btn').onclick = () => {
      console.log('戻るボタンクリック');
      location.hash = '';
    };
    console.log('詳細表示完了');
  }

  // 意見の傾向グラフ
  function renderTrends(trends) {
    if (!trends || !trends.length) return '';
    const max = Math.max(...trends.map(t => t.value));
    return `
      <div class="discussion-detail-block">
        <h4>意見の傾向</h4>
        <div class="discussion-trends-bar">
          ${trends.map(t => `
            <div class="discussion-trend-item">
              <div class="discussion-trend-label">${t.label}</div>
              <div class="discussion-trend-bar-inner">
                <div class="discussion-trend-bar-fill" style="width:${(t.value / max) * 100}%"></div>
              </div>
              <div class="discussion-trend-value">${t.value}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 日付整形
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
  }

  // ハッシュ監視
  function onHashChange() {
    const id = location.hash.replace('#', '');
    console.log('ハッシュ変更:', location.hash, 'ID:', id);
    if (id) {
      renderDetail(id);
    } else {
      renderList();
    }
  }

  console.log('イベントリスナー設定');
  window.addEventListener('hashchange', onHashChange);
  console.log('初期表示開始');
  onHashChange();
  console.log('=== discussion.js 初期化完了 ===');
}); 