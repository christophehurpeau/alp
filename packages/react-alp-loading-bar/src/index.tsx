/* eslint-disable react/destructuring-assignment */
import type { ReactElement } from "react";
import { PureComponent } from "react";

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
const random = (): number => Math.ceil(Math.random() * 100) / 100;

/**
 * around:
 * at 100ms 20%
 * at 1s 40%
 * at 2s 60%
 * at 3s 80%
 */
const calculatePercent = (percent: number): number => {
  if (percent < 60) return percent + random() * 10 + 5;
  if (percent < 70) return percent + random() * 10 + 3;
  else if (percent < 80) return percent + random() + 5;
  else if (percent < 90) return percent + random() + 1;
  else if (percent < 95) return percent + 0.1;
  else return percent;
};

interface LoadingBarProps {
  LoadingBarComponent: React.ComponentType<{ progress: number }>;
  websocket: WebsocketInterface;
}

interface LoadingBarState {
  loading: boolean;
  hidden: boolean;
  progress: number;
}

interface WebsocketInterface {
  isConnected: () => boolean;
  on: (event: "connect" | "disconnect", callback: () => unknown) => void;
}

export default class LoadingBar extends PureComponent<
  LoadingBarProps,
  LoadingBarState
> {
  override state = {
    loading: true,
    hidden: true,
    progress: 1,
  };

  fadeOffTimeout?: ReturnType<typeof setTimeout>;

  resetTimeout?: ReturnType<typeof setTimeout>;

  first20Timeout?: ReturnType<typeof setTimeout>;

  progressTimer?: ReturnType<typeof setTimeout>;

  override componentDidMount(): void {
    if (this.props.websocket.isConnected()) {
      this.setState((prevState) => ({
        loading: false,
        progress: 100,
        hidden: prevState.hidden || prevState.progress === 100,
      }));
    }
    this.props.websocket.on("connect", () => {
      this.setState({ loading: false });
    });
    this.props.websocket.on("disconnect", () => {
      this.setState({ loading: true, progress: 1, hidden: false });
    });
  }

  override componentDidUpdate(
    prevProps: LoadingBarProps,
    prevState: LoadingBarState,
  ): void {
    if (this.props.websocket !== prevProps.websocket) {
      throw new Error("Unsupported at the moment");
    }
    if (this.state.loading !== prevState.loading) {
      if (this.state.loading) {
        this.showBar();
      } else {
        this.hideBar();
      }
    }
  }

  override componentWillUnmount(): void {
    if (this.fadeOffTimeout) clearTimeout(this.fadeOffTimeout);
    if (this.resetTimeout) clearTimeout(this.resetTimeout);
    if (this.first20Timeout) clearTimeout(this.first20Timeout);
    if (this.progressTimer) clearInterval(this.progressTimer);
  }

  private showBar(): void {
    if (this.fadeOffTimeout) clearTimeout(this.fadeOffTimeout);
    if (this.resetTimeout) clearTimeout(this.resetTimeout);

    this.first20Timeout = setTimeout(() => {
      this.setState({ progress: 20 });
    }, 100);

    this.progressTimer = setInterval(() => {
      this.setState((prevState) => {
        const newValue = calculatePercent(prevState.progress);
        return { progress: newValue };
      });
    }, 500);
  }

  private hideBar(): void {
    if (this.first20Timeout) clearTimeout(this.first20Timeout);
    if (this.progressTimer) clearInterval(this.progressTimer);

    this.fadeOffTimeout = setTimeout(() => {
      this.setState({
        progress: 100,
      });
    }, 500);

    this.resetTimeout = setTimeout(() => {
      this.setState({
        hidden: true,
        progress: 1,
      });
    }, 1000);
  }

  override render(): ReactElement {
    const LoadingBarComponent = this.props.LoadingBarComponent;

    return (
      <div
        hidden={this.state.hidden}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <LoadingBarComponent progress={this.state.progress} />
      </div>
    );
  }
}
