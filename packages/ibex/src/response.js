export default {
  redirect(url) {
    if (this.app.emit('redirect', url) === false) {
      window.location.href = url;
    }
  },
};
