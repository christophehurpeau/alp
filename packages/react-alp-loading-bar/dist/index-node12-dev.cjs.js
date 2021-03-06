'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const React = require('react');
const ReactAlpContext = require('react-alp-context');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e['default'] : e; }

const React__default = /*#__PURE__*/_interopDefaultLegacy(React);
const ReactAlpContext__default = /*#__PURE__*/_interopDefaultLegacy(ReactAlpContext);

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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
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
    return /*#__PURE__*/React__default.createElement("div", {
      hidden: this.state.hidden,
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 4,
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React__default.createElement(LoadingBarComponent, {
      progress: this.state.progress
    }));
  }

}
LoadingBar.contextType = ReactAlpContext__default;

exports.default = LoadingBar;
//# sourceMappingURL=index-node12-dev.cjs.js.map
