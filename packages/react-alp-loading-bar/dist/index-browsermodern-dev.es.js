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

const random = function random() {
  return Math.ceil(Math.random() * 100) / 100;
};
/**
 * around:
 * at 100ms 20%
 * at 1s 40%
 * at 2s 60%
 * at 3s 80%
 */


const calculatePercent = function calculatePercent(percent) {
  if (percent < 60) return percent + random() * 10 + 5;
  if (percent < 70) return percent + random() * 10 + 3;else if (percent < 80) return percent + random() + 5;else if (percent < 90) return percent + random() + 1;else if (percent < 95) return percent + 0.1;else return percent;
};

class LoadingBar extends PureComponent {
  constructor(...args) {
    super(...args);
    this.state = {
      loading: true,
      hidden: true,
      progress: 1
    };
  }

  componentDidMount() {
    var _this = this;

    const websocket = this.getWebsocket();

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
      _this.setState({
        loading: false
      });
    });
    websocket.on('disconnect', function () {
      _this.setState({
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
    var _this2 = this;

    clearTimeout(this.fadeOffTimeout);
    clearTimeout(this.resetTimeout);
    this.first20Timeout = setTimeout(function () {
      _this2.setState({
        progress: 20
      });
    }, 100);
    this.progressTimer = setInterval(function () {
      _this2.setState(function (prevState) {
        const newValue = calculatePercent(prevState.progress);
        return {
          progress: newValue
        };
      });
    }, 500);
  }

  hideBar() {
    var _this3 = this;

    clearTimeout(this.first20Timeout);
    clearInterval(this.progressTimer);
    this.fadeOffTimeout = setTimeout(function () {
      _this3.setState({
        progress: 100
      });
    }, 500);
    this.resetTimeout = setTimeout(function () {
      _this3.setState({
        hidden: true,
        progress: 1
      });
    }, 1000);
  }

  render() {
    const LoadingBarComponent = this.props.LoadingBarComponent;
    return React.createElement("div", {
      hidden: this.state.hidden,
      style: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 4,
        pointerEvents: 'none'
      }
    }, React.createElement(LoadingBarComponent, {
      progress: this.state.progress
    }));
  }

}
LoadingBar.contextType = ReactAlpContext;

export default LoadingBar;
//# sourceMappingURL=index-browsermodern-dev.es.js.map
