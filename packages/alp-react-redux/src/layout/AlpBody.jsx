import { Body } from 'fody/src';
import type { ReactElementType, ReactNodeType } from '../types';

type PropsType = {
  children: ReactNodeType,
};

export default ({ children, ...props }: PropsType): ReactElementType => (
  <Body {...props}>
    <div id="loading-bar" className="loading-bar"><div className="progress" /></div>
    {children}
  </Body>
);
