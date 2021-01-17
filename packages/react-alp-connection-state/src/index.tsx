import type { ReactElement } from 'react';
import React, { useContext, useEffect, useRef } from 'react';
import ReactAlpContext from 'react-alp-context';
import { T } from 'react-alp-translate';
import '../ConnectionState.global.scss';

type State = null | 'connecting' | 'connected' | 'disconnected';

interface ConnectionStateProps {
  state: State;
}

export default function ConnectionState({
  state,
}: ConnectionStateProps): ReactElement {
  const ctx = useContext(ReactAlpContext);
  const notLoggedIn = !(ctx.sanitizedState as { user?: unknown }).user;

  const unloadingRef = useRef<boolean>(false);
  const currentStateRef = useRef(state);
  if (unloadingRef.current === false) {
    currentStateRef.current = state;
  }
  const currentState = currentStateRef.current;

  useEffect((): (() => void) => {
    const beforeUnloadHandler = (): void => {
      unloadingRef.current = true;
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);

    return (): void => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, []);

  return (
    <div
      hidden={!state || notLoggedIn || currentState === 'connected'}
      className="alp-connection-state"
    >
      {!state || notLoggedIn ? null : (
        <div>
          <T id={`connectionState.${currentState as string}`} />
        </div>
      )}
    </div>
  );
}
