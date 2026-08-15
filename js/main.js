(function () {
  var html   = document.documentElement;
  var toggle = document.getElementById('theme-toggle');

  function applyTheme(dark) {
    html.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('modcon-theme', dark ? 'dark' : 'light');
    syncGiscus(dark);
  }

  function syncGiscus(dark) {
    var frame = document.querySelector('iframe.giscus-frame');
    if (!frame) return;
    frame.contentWindow.postMessage(
      { giscus: { setConfig: { theme: dark ? 'dark_dimmed' : 'light' } } },
      'https://giscus.app'
    );
  }

  var stored    = localStorage.getItem('modcon-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(stored ? stored === 'dark' : prefersDark);

  if (toggle) {
    toggle.addEventListener('click', function () {
      applyTheme(html.dataset.theme !== 'dark');
    });
  }

  // Giscus loads asynchronously — re-sync once the iframe appears
  var observer = new MutationObserver(function () {
    var frame = document.querySelector('iframe.giscus-frame');
    if (frame) {
      observer.disconnect();
      setTimeout(function () { syncGiscus(html.dataset.theme === 'dark'); }, 500);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
})();
