import type {
  ComponentType,
  FunctionComponent,
  ReactElement,
  ReactNode,
} from 'react';
import type { RouteChildrenProps, match as Match } from 'react-router';
import { Route } from 'react-router';
import { Transition } from 'react-transition-group';
import type { Except } from 'type-fest';

export interface BaseComponentProps<Params> {
  match: Match<Params> | null;
  exiting: boolean;
  onClose: () => void;
}

interface WrapperComponentProps {
  children: ReactNode;
  visible: boolean;
}

interface RouteMatchTransitionProps<
  Params,
  ComponentProps extends BaseComponentProps<Params>,
> {
  path: string;
  closePath: string;
  timeout: number;
  component: ComponentType<ComponentProps>;
  wrapperComponent?: ComponentType<WrapperComponentProps>;
}

const DefaultWrapperComponent: FunctionComponent<WrapperComponentProps> = ({
  children,
  visible,
}): ReactElement => children as ReactElement;

export default function RouteMatchTransition<
  Params,
  AllProps extends {
    [P in keyof BaseComponentProps<Params>]?: never;
  } & RouteMatchTransitionProps<any, any>,
>({
  path,
  closePath,
  timeout,
  component: Component,
  wrapperComponent: WrapperComponent = DefaultWrapperComponent,
  ...otherProps
}: RouteMatchTransitionProps<
  Params,
  BaseComponentProps<Params> &
    Except<AllProps, keyof RouteMatchTransitionProps<any, any>>
> &
  AllProps): ReactElement {
  return (
    <Route path={path}>
      {({ match, history }: RouteChildrenProps<Params>): ReactElement => {
        const handleClose = (): void => {
          history.push(closePath);
        };
        return (
          <Transition
            exit
            enter={false}
            in={Boolean(match !== null)}
            timeout={timeout}
          >
            {(state): ReactElement | null => {
              switch (state) {
                case 'entering':
                case 'entered':
                case 'exiting':
                  return (
                    <Component
                      match={match}
                      exiting={state === 'exiting'}
                      onClose={handleClose}
                      {...otherProps}
                    />
                  );
                case 'exited':
                case 'unmounted':
                  return null;
              }
            }}
          </Transition>
        );
      }}
    </Route>
  );
}
