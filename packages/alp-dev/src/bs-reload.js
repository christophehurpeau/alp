import bs from './browser-sync';

let _reloadTimeout;

export default function reload() {
  if (_reloadTimeout) clearTimeout(_reloadTimeout);
  _reloadTimeout = setTimeout(() => bs.reload(), 1000);
}
