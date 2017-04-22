import { Provider } from 'react-redux';
import AlpReactApp from './AlpReactApp';
import type { ReactNodeType, ReactElementType } from '../types';

type PropsType = {
  children: ReactNodeType,
  store: Object,
};

export default ({ children, store, ...props }: PropsType): ReactElementType => (
  <Provider store={store}>
    <AlpReactApp {...props}>{children}</AlpReactApp>
  </Provider>
);
