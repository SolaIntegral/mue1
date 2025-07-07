// 全ページ共通のスクリプト
console.log('=== script.js 読み込み開始 ===');

/**
 * ナビゲーションを読み込んで表示する
 */
function loadNavigation() {
  console.log('loadNavigation() 実行開始');
  // すべてのページでnav.htmlを読み込む
  fetch('nav.html')
    .then(res => {
      console.log('nav.html fetch結果:', res.status, res.statusText);
      if (!res.ok) {
        throw new Error('nav.htmlの読み込みに失敗しました。');
      }
      return res.text();
    })
    .then(html => {
      console.log('nav.html取得成功、長さ:', html.length);
      const navPlaceholder = document.getElementById('nav-placeholder');
      if (navPlaceholder) {
        console.log('nav-placeholder要素発見、HTML設定');
        navPlaceholder.innerHTML = html;
        // ナビゲーションが読み込まれた後に、ナビゲーション用のJSを読み込む
        loadNavScript();
      } else {
        console.error('nav-placeholder要素が見つかりません');
      }
    })
    .catch(error => {
      console.error('nav.html読み込みエラー:', error);
      const navPlaceholder = document.getElementById('nav-placeholder');
      if (navPlaceholder) {
        navPlaceholder.innerHTML = '<p style="color: red; text-align: center;">ナビゲーションの読み込みに失敗しました。</p>';
      }
    });
}

/**
 * ナビゲーション用のJavaScriptを読み込む
 */
function loadNavScript() {
  console.log('loadNavScript() 実行開始');
  // 既存のnav.jsスクリプトがあれば削除
  const existingScript = document.querySelector('script[src="nav.js"]');
  if (existingScript) {
    console.log('既存のnav.jsスクリプトを削除');
    existingScript.remove();
  }

  // 新しいスクリプトタグを作成して追加
  const script = document.createElement('script');
  script.src = 'nav.js';
  script.defer = true; // DOM解析後に実行
  console.log('nav.jsスクリプトタグ作成:', script);
  document.body.appendChild(script);
  console.log('nav.jsスクリプト追加完了');
}

// DOMが読み込まれたらナビゲーションを読み込む
console.log('DOMContentLoadedイベントリスナー設定');
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded発火 - loadNavigation()実行');
  loadNavigation();
});

console.log('=== script.js 読み込み完了 ==='); 