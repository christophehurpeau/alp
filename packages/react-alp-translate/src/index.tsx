import type React from 'react';
import useT from './useT';

interface Props {
  id: string;
  children?: never;
  [propName: string]: any;
}

function T({ id, ...props }: Props): React.ReactElement {
  const t = useT(id, props, Object.values(props));
  return t as unknown as React.ReactElement;
}

export { T };

export { default as useTs } from './useTs';
export { default as useT } from './useT';
