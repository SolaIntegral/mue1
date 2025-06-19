// サステナディスカッションまとめ機能
// 一覧と詳細をSPA風に切り替え

document.addEventListener('DOMContentLoaded', function () {
  if (!window.discussionData) return;

  const listView = document.getElementById('discussion-list-view');
  const detailView = document.getElementById('discussion-detail-view');

  // 一覧表示
  function renderList() {
    listView.innerHTML = '';
    detailView.style.display = 'none';
    listView.style.display = 'grid';
    discussionData.forEach(discussion => {
      const card = document.createElement('div');
      card.className = 'discussion-card';
      card.innerHTML = `
        <div class="discussion-card-title">${discussion.title}</div>
        <div class="discussion-card-date">${formatDate(discussion.date)}</div>
        <div class="discussion-card-summary">${discussion.summary.replace(/<[^>]+>/g, '')}</div>
        <div class="discussion-card-topics">${discussion.topics}</div>
      `;
      card.onclick = () => {
        location.hash = '#' + discussion.id;
      };
      listView.appendChild(card);
    });
  }

  // 詳細表示
  function renderDetail(id) {
    const discussion = discussionData.find(d => d.id === id);
    if (!discussion) return renderList();
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
      location.hash = '';
    };
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
    if (id) {
      renderDetail(id);
    } else {
      renderList();
    }
  }

  window.addEventListener('hashchange', onHashChange);
  onHashChange();
}); 