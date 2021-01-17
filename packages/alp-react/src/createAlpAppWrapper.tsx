import type { Context } from 'alp-types';
import type {
  ComponentClass,
  ErrorInfo,
  ReactChild,
  ReactElement,
} from 'react';
import React, { Component } from 'react';
import ReactAlpContext from 'react-alp-context';

declare global {
  interface Window {
    Sentry?: { captureException: (error: Error, extra: unknown) => void };
  }
}

interface AlpAppProps {}

interface AlpAppState {
  error: null | Error;
}

export default function createAlpAppWrapper(
  app: ReactChild,
  context: Context,
): ComponentClass<AlpAppProps, AlpAppState> {
  return class AlpAppWrapper extends Component<AlpAppProps, AlpAppState> {
    state = {
      error: null,
    };

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
      console.error(error, errorInfo);
      if (window.Sentry) {
        window.Sentry.captureException(error, {
          contexts: {
            react: {
              componentStack: errorInfo.componentStack,
            },
          },
        });
      }
    }

    render(): ReactElement {
      if (this.state.error) return <div>An unexpected error occured</div>;
      return (
        <ReactAlpContext.Provider value={context}>
          {app}
        </ReactAlpContext.Provider>
      );
    }
  };
}
