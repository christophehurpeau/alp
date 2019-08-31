'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

const React = require('react');
const React__default = _interopDefault(React);
const ReactAlpContext = _interopDefault(require('react-alp-context'));

var _jsxFileName = "/Users/chris/Work/alp/alp/packages/react-alp-loading-bar/src/index.tsx";
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

const random = () => Math.ceil(Math.random() * 100) / 100;
/**
 * around:
 * at 100ms 20%
 * at 1s 40%
 * at 2s 60%
 * at 3s 80%
 */


const calculatePercent = percent => {
  if (percent < 60) return percent + random() * 10 + 5;
  if (percent < 70) return percent + random() * 10 + 3;else if (percent < 80) return percent + random() + 5;else if (percent < 90) return percent + random() + 1;else if (percent < 95) return percent + 0.1;else return percent;
};

class LoadingBar extends React.PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      loading: true,
      hidden: true,
      progress: 1
    };
  }

  componentDidMount() {
    const websocket = this.getWebsocket();

    if (websocket.isConnected()) {
      this.setState(prevState => ({
        loading: false,
        progress: 100,
        hidden: prevState.hidden || prevState.progress === 100
      }));
    }

    websocket.on('connect', () => {
      this.setState({
        loading: false
      });
    });
    websocket.on('disconnect', () => {
      this.setState({
        loading: true,
        progress: 1,
        hidden: false
      });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.loading !== prevState.loading) {
      if (this.state.loading) {
        this.showBar();
      } else {
        this.hideBar();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.fadeOffTimeout);
    clearTimeout(this.resetTimeout);
    clearTimeout(this.first20Timeout);
    clearInterval(this.progressTimer);
  }

  getWebsocket() {
    return this.context.app.websocket;
  }

  showBar() {
    clearTimeout(this.fadeOffTimeout);
    clearTimeout(this.resetTimeout);
    this.first20Timeout = setTimeout(() => {
      this.setState({
        progress: 20
      });
    }, 100);
    this.progressTimer = setInterval(() => {
      this.setState(prevState => {
        const newValue = calculatePercent(prevState.progress);
        return {
          progress: newValue
        };
      });
    }, 500);
  }

  hideBar() {
    clearTimeout(this.first20Timeout);
    clearInterval(this.progressTimer);
    this.fadeOffTimeout = setTimeout(() => {
      this.setState({
        progress: 100
      });
    }, 500);
    this.resetTimeout = setTimeout(() => {
      this.setState({
        hidden: true,
        progress: 1
      });
    }, 1000);
  }

  render() {
    const LoadingBarComponent = this.props.LoadingBarComponent;
    return React__default.createElement("div", {
      hidden: this.state.hidden,
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 4,
        pointerEvents: 'none'
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 148
      },
      __self: this
    }, React__default.createElement(LoadingBarComponent, {
      progress: this.state.progress,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 159
      },
      __self: this
    }));
  }

}
LoadingBar.contextType = ReactAlpContext;

exports.default = LoadingBar;
//# sourceMappingURL=index-node10-dev.cjs.js.map
