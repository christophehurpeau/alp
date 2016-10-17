'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = loadingBar;
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
  if (percent < 60) {
    return percent + random() * 10 + 20;
  } else if (percent < 80) {
    return percent + random() + 0.5;
  } else if (percent < 95) {
    return percent + 0.1;
  } else {
    return percent;
  }
}

let loading = null;
function loadingBar() {
  if (loading) throw new Error('Already loading');
  loading = true;

  const loadingBar = document.getElementById('loading-bar');
  const loadingBarProgress = loadingBar.firstElementChild;
  loadingBarProgress.style.width = '1%';
  loadingBarProgress.style.willChange = 'width';
  loadingBar.style.display = 'block';

  let percent = 20;
  const first20Timeout = setTimeout(() => {
    loadingBarProgress.style.width = '20%';
  }, 100);

  const progressTimer = setInterval(() => {
    loadingBarProgress.style.width = `${ percent = calculatePercent(percent) }%`;
  }, 500);

  return () => {
    clearTimeout(first20Timeout);
    clearInterval(progressTimer);
    loadingBarProgress.style.width = '100%';
    loadingBarProgress.style.willChange = '';
    loadingBar.style.willChange = 'display';
    loading = false;

    setTimeout(() => {
      if (!loading) {
        loadingBar.style.display = 'none';
        loadingBar.style.willChange = '';
      }
    }, 500);
  };
}
//# sourceMappingURL=loading-bar.js.map