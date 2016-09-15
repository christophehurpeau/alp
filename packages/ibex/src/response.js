/* global location */

export default {
  redirect(url) {
    if (this.app.emit('redirect', url) === false) {
      location.href = url;
    }
  },
};
