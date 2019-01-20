import * as React from 'react';
import ReactAlpContext from 'react-alp-context';

type ChildrenCallback = (translated: string) => React.ReactChild;

interface Props {
  id: string;
  children?: ChildrenCallback;
  [propName: string]: any;
}

export type AlpContext = {
  t: (id: string, args: { [key: string]: any }) => string;
};

export default class Translate extends React.Component<Props> {
  static contextType = ReactAlpContext;

  // eslint-disable-next-line react/sort-comp
  context!: React.ContextType<typeof ReactAlpContext>;

  render() {
    const { id, children, ...props } = this.props;
    const translated: string = this.context.t(id, props);
    if (children) {
      return children(translated);
    }
    return translated;
  }
}
