/* global location */

export default {
  redirect: function redirect(url) {
    if (this.app.emit('redirect', url) === false) {
      location.href = url;
    }
  }
};
//# sourceMappingURL=response.js.map