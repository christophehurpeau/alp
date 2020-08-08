import { ReactElement } from 'react';
import '../ConnectionState.global.scss';
declare type State = null | 'connecting' | 'connected' | 'disconnected';
interface ConnectionStateProps {
    state: State;
}
export default function ConnectionState({ state, }: ConnectionStateProps): ReactElement;
export {};
//# sourceMappingURL=index.d.ts.map