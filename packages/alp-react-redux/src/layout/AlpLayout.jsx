import type { LayoutPropsType, ReactElementType } from 'fody/src/types';
import { Html } from 'fody/src';
import AlpHead from './AlpHead';
import AlpBody from './AlpBody';

export default ({ helmet, content, ...props }: LayoutPropsType): ReactElementType => (
  <Html helmet={helmet}>
    <AlpHead helmet={helmet} {...props} />
    <AlpBody>
      <div id="app" dangerouslySetInnerHTML={{ __html: content }} />
    </AlpBody>
  </Html>
);
