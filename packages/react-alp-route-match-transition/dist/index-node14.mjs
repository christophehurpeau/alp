import { Route } from 'react-router';
import { Transition } from 'react-transition-group';
import { jsx } from 'react/jsx-runtime';

const DefaultWrapperComponent = ({
  children,
  visible
}) => children;

function RouteMatchTransition({
  path,
  closePath,
  timeout,
  component: Component,
  wrapperComponent: WrapperComponent = DefaultWrapperComponent,
  ...otherProps
}) {
  return /*#__PURE__*/jsx(Route, {
    path: path,
    children: ({
      match,
      history
    }) => {
      const handleClose = () => {
        history.push(closePath);
      };

      return /*#__PURE__*/jsx(Transition, {
        exit: true,
        enter: false,
        in: Boolean(match !== null),
        timeout: timeout,
        children: state => {
          switch (state) {
            case 'entering':
            case 'entered':
            case 'exiting':
              return /*#__PURE__*/jsx(Component, {
                match: match,
                exiting: state === 'exiting',
                onClose: handleClose,
                ...otherProps
              });

            case 'exited':
            case 'unmounted':
              return null;
          }
        }
      });
    }
  });
}

export { RouteMatchTransition as default };
//# sourceMappingURL=index-node14.mjs.map
