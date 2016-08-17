'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
/* global location */

exports.default = {
    redirect: function redirect(url) {
        if (this.app.emit('redirect', url) === false) {
            location.href = url;
        }
    }
};
//# sourceMappingURL=response.js.map