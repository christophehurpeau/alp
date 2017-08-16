/* global location */

export default {
  redirect(url) {
    this.app.emit('redirect', url) === false && (location.href = url);
  }
};
//# sourceMappingURL=response.js.map