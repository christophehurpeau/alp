import React, { ReactElement, useContext, useEffect, useState } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';
import '../ConnectionState.global.scss';

type State = null | 'connecting' | 'connected' | 'disconnected';

export default function ConnectionState(): ReactElement {
  const ctx = useContext(ReactAlpContext);
  const notConnected = !ctx.sanitizedState.user;

  const [connectionState, setConnectionState] = useState<State>(null);
  useEffect(
    (): (() => void) => {
      const websocket = ctx.app.websocket;
      let unloading = false;

      window.addEventListener(
        'beforeunload',
        (): void => {
          unloading = true;
        },
      );

      const connectedHandler = websocket.on(
        'connect',
        (): void => {
          setConnectionState('connected');
        },
      );
      const disconnectedHandler = websocket.on(
        'disconnect',
        (): void => {
          if (unloading) return;
          setConnectionState('disconnected');
        },
      );

      setConnectionState(websocket.connected ? 'connected' : 'connecting');

      return (): void => {
        websocket.off('connected', connectedHandler);
        websocket.off('disconnected', disconnectedHandler);
      };
    },
  );

  return (
    <div
      hidden={
        !connectionState || notConnected || connectionState === 'connected'
      }
      className="alp-connection-state"
    >
      {!connectionState || notConnected ? null : (
        <div>
          <T id={`connectionState.${connectionState}`} />
        </div>
      )}
    </div>
  );
}
