import React, { Component, ReactNode } from 'react';
import Logger from 'nightingale-logger';
import ReactAlpContext from 'react-alp-context';

const logger = new Logger('react-alp-subscribe-container');

export interface SubscribeContainerProps {
  children: ReactNode;
  onEvent: (e: any) => any;
  name?: string;
  names?: Array<string>;
  visibleTimeout?: number;
}

export default class SubscribeContainer extends Component<
  SubscribeContainerProps
> {
  static defaultProps = {
    visibleTimeout: 1000 * 60 * 2, // 2 minutes
  };

  static contextType = ReactAlpContext;

  // eslint-disable-next-line react/sort-comp
  context!: React.ContextType<typeof ReactAlpContext>;

  subscribed: boolean = false;

  timeout: number | undefined = undefined;

  componentDidMount() {
    const websocket = this.getWebsocket();
    websocket.on('connect', this.subscribe);
    if (websocket.isConnected()) {
      this.subscribe();
    }
    document.addEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
      false,
    );
  }

  componentWillUnmount() {
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
      false,
    );
    this.getWebsocket().off('connect', this.subscribe);
    this.unsubscribe();
  }

  handleVisibilityChange = () => {
    if (!document.hidden) {
      if (this.timeout != null) {
        logger.log('timeout cleared', {
          names: this.props.names,
          name: this.props.name,
        });
        clearTimeout(this.timeout);
      } else {
        logger.debug('resubscribe', {
          names: this.props.names,
          name: this.props.name,
        });
        this.subscribe();
      }
      return;
    }

    if (!this.subscribed) return;

    logger.log('timeout visible', {
      names: this.props.names,
      name: this.props.name,
    });
    this.timeout = setTimeout(this.unsubscribe, this.props.visibleTimeout);
  };

  subscribe = () => {
    if (document.hidden) return;

    logger.log('subscribe', { names: this.props.names, name: this.props.name });
    this.subscribed = true;
    const names = this.props.names || [this.props.name];
    const websocket = this.getWebsocket();
    names.forEach((name) =>
      websocket.emit(`subscribe:${name}`).then(this.props.onEvent),
    );
  };

  unsubscribe = () => {
    this.timeout = undefined;
    if (!this.subscribed) return;
    logger.log('unsubscribe', {
      names: this.props.names,
      name: this.props.name,
    });
    this.subscribed = false;
    const names = this.props.names || [this.props.name];
    const websocket = this.getWebsocket();
    if (websocket.isConnected()) {
      names.forEach((name) => websocket.emit(`unsubscribe:${name}`));
    }
  };

  getWebsocket() {
    return this.context.app.websocket;
  }

  render() {
    return this.props.children;
  }
}
