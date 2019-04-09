import React from 'react';
import useT from './useT';
import useTs from './useTs';

interface Props {
  id: string;
  children?: never;
  [propName: string]: any;
}

function T({ id, ...props }: Props): React.ReactElement {
  const t = useT(id, props, Object.values(props));
  return (t as unknown) as React.ReactElement;
}

export { T, useT, useTs };
