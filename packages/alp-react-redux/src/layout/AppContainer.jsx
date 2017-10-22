import type { Element, Node } from 'react';

type PropsType = {| children: Node |};

export default ({ children }: PropsType): Element<'div'> => <div>{children}</div>;
