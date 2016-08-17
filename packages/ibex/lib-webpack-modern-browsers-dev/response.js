/* global location */

export default {
    redirect(url) {
        if (this.app.emit('redirect') === false) {
            location.href = url;
        }
    }
};
//# sourceMappingURL=response.js.map