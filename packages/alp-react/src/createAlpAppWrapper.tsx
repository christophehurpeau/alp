import React, { Component, ReactChild } from 'react';
import { Context } from 'alp-types';
import ReactAlpContext from 'react-alp-context';

declare global {
  interface Window {
    Raven: any;
  }
}

interface AlpAppProps {}

interface AlpAppState {
  error: null | Error;
  appState: any;
}

export default function createAlpAppWrapper(app: ReactChild, context: Context) {
  return class AlpAppWrapper extends Component<AlpAppProps, AlpAppState> {
    state = {
      error: null,
      appState: context.sanitizedState,
    };

    componentDidCatch(error: Error, errorInfo: any) {
      console.error(error, errorInfo);
      if (window.Raven) {
        window.Raven.captureException(error, { extra: errorInfo });
      }
    }

    render() {
      if (this.state.error) return <div>An unexpected error occured</div>;
      return (
        <ReactAlpContext.Provider value={context}>
          {app}
        </ReactAlpContext.Provider>
      );
    }
  };
}
