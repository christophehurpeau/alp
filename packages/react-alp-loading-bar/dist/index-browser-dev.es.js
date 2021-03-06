import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import React, { PureComponent } from 'react';
import ReactAlpContext from 'react-alp-context';

/*
Example with antd:
import { Progress } from 'antd';

const LoadingBarComponent = ({ progress }) => (
  <Progress
    type="line"
    status="active"
    percent={progress}
    showInfo={false}
  />
);
*/

/* number between 0 and 1 */

var random = function random() {
  return Math.ceil(Math.random() * 100) / 100;
};
/**
 * around:
 * at 100ms 20%
 * at 1s 40%
 * at 2s 60%
 * at 3s 80%
 */


var calculatePercent = function calculatePercent(percent) {
  if (percent < 60) return percent + random() * 10 + 5;
  if (percent < 70) return percent + random() * 10 + 3;else if (percent < 80) return percent + random() + 5;else if (percent < 90) return percent + random() + 1;else if (percent < 95) return percent + 0.1;else return percent;
};

var LoadingBar = /*#__PURE__*/function (_PureComponent) {
  _inheritsLoose(LoadingBar, _PureComponent);

  function LoadingBar() {
    var _this, _len, args, _key;

    for (_len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _PureComponent.call.apply(_PureComponent, [this].concat(args)) || this;
    _this.state = {
      loading: true,
      hidden: true,
      progress: 1
    };
    return _this;
  }

  var _proto = LoadingBar.prototype;

  _proto.componentDidMount = function componentDidMount() {
    var _this2 = this;

    var websocket = this.getWebsocket();

    if (websocket.isConnected()) {
      this.setState(function (prevState) {
        return {
          loading: false,
          progress: 100,
          hidden: prevState.hidden || prevState.progress === 100
        };
      });
    }

    websocket.on('connect', function () {
      _this2.setState({
        loading: false
      });
    });
    websocket.on('disconnect', function () {
      _this2.setState({
        loading: true,
        progress: 1,
        hidden: false
      });
    });
  };

  _proto.componentDidUpdate = function componentDidUpdate(prevProps, prevState) {
    if (this.state.loading !== prevState.loading) {
      if (this.state.loading) {
        this.showBar();
      } else {
        this.hideBar();
      }
    }
  };

  _proto.componentWillUnmount = function componentWillUnmount() {
    clearTimeout(this.fadeOffTimeout);
    clearTimeout(this.resetTimeout);
    clearTimeout(this.first20Timeout);
    clearInterval(this.progressTimer);
  };

  _proto.getWebsocket = function getWebsocket() {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
    return this.context.app.websocket;
  };

  _proto.showBar = function showBar() {
    var _this3 = this;

    clearTimeout(this.fadeOffTimeout);
    clearTimeout(this.resetTimeout);
    this.first20Timeout = setTimeout(function () {
      _this3.setState({
        progress: 20
      });
    }, 100);
    this.progressTimer = setInterval(function () {
      _this3.setState(function (prevState) {
        var newValue = calculatePercent(prevState.progress);
        return {
          progress: newValue
        };
      });
    }, 500);
  };

  _proto.hideBar = function hideBar() {
    var _this4 = this;

    clearTimeout(this.first20Timeout);
    clearInterval(this.progressTimer);
    this.fadeOffTimeout = setTimeout(function () {
      _this4.setState({
        progress: 100
      });
    }, 500);
    this.resetTimeout = setTimeout(function () {
      _this4.setState({
        hidden: true,
        progress: 1
      });
    }, 1000);
  };

  _proto.render = function render() {
    var LoadingBarComponent = this.props.LoadingBarComponent;
    return /*#__PURE__*/React.createElement("div", {
      hidden: this.state.hidden,
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 4,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement(LoadingBarComponent, {
      progress: this.state.progress
    }));
  };

  return LoadingBar;
}(PureComponent);

LoadingBar.contextType = ReactAlpContext;

export default LoadingBar;
//# sourceMappingURL=index-browser-dev.es.js.map
