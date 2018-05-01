import { Component, ReactElement } from 'react';
import { Dispatch, AnyAction } from 'redux';
import PropTypes from 'prop-types';
import Logger from 'nightingale-logger';

const logger = new Logger('react-alp-subscribe-container');

export interface OwnProps {
  children: ReactElement<any>;
  // eslint-disable-next-line no-restricted-globals
  name?: string;
  names?: Array<string>;
  visibleTimeout?: number;
}

export interface ConnectProps {
  dispatch: Dispatch<any>;
}

export default class SubscribeContainer extends Component<OwnProps & ConnectProps, never> {
  static defaultProps = {
    visibleTimeout: 1000 * 60 * 2, // 2 minutes
  };

  static contextTypes = {
    context: PropTypes.object,
  };

  subscribed: boolean = false;
  timeout: number | undefined = undefined;

  componentDidMount() {
    const websocket = this.getWebsocket();
    websocket.on('connect', this.subscribe);
    if (websocket.isConnected()) {
      this.subscribe();
    }
    document.addEventListener('visibilitychange', this.handleVisibilityChange, false);
  }

  componentWillUnmount() {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange, false);
    this.getWebsocket().off('connect', this.subscribe);
    this.unsubscribe();
  }

  getWebsocket() {
    return this.context.context.app.websocket;
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
    const { dispatch } = this.props;
    const names = this.props.names || [this.props.name];
    const websocket = this.getWebsocket();
    names.forEach(name =>
      websocket.emit(`subscribe:${name}`).then((action: AnyAction) => action && dispatch(action)),
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
      names.forEach(name => websocket.emit(`unsubscribe:${name}`));
    }
  };

  render(): ReactElement<any> {
    return this.props.children;
  }
}
