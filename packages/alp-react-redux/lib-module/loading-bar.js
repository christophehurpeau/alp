/* global document */

function random() {
  return Math.ceil(Math.random() * 100) / 100;
}

/**
 * around:
 * 1s for 60%
 * 4s for 80%
 * 6s for 95%
 */
function calculatePercent(percent) {
  return percent < 60 ? percent + random() * 10 + 20 : percent < 80 ? percent + random() + 0.5 : percent < 95 ? percent + 0.1 : percent;
}

var loading = null;
export default function loadingBar() {
  if (loading) throw new Error('Already loading');
  loading = true;


  var loadingBar = document.getElementById('loading-bar');
  var loadingBarProgress = loadingBar.firstElementChild;
  loadingBarProgress.style.width = '1%', loadingBarProgress.style.willChange = 'width', loadingBar.style.display = 'block';


  var percent = 20;
  var first20Timeout = setTimeout(function () {
    loadingBarProgress.style.width = '20%';
  }, 100);

  var progressTimer = setInterval(function () {
    loadingBarProgress.style.width = (percent = calculatePercent(percent)) + '%';
  }, 500);

  return function () {
    clearTimeout(first20Timeout), clearInterval(progressTimer), loadingBarProgress.style.width = '100%', loadingBarProgress.style.willChange = '', loadingBar.style.willChange = 'display', loading = false, setTimeout(function () {
      loading || (loadingBar.style.display = 'none', loadingBar.style.willChange = '');
    }, 500);
  };
}
//# sourceMappingURL=loading-bar.js.map