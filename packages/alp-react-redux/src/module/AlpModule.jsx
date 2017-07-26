import type { ReactNodeType, ReactElementType } from '../types';

type PropsType = {|
  children: ReactNodeType,
|};

export default ({ children }: PropsType): ReactElementType => children;
