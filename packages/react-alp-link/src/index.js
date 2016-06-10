import { PropTypes } from 'react';

LinkComponent.propTypes = {
    to: PropTypes.string.isRequired,
    params: PropTypes.object,
    children: PropTypes.node,
};

LinkComponent.contextTypes = {
    context: PropTypes.object,
};

type Props = {
    to: string,
    params: ?Object,
};

export default function LinkComponent({ to, params, children, ...props }: Props, { context: ctx }) {
    return <a href={ctx.urlGenerator(to, params)} {...props}>{children}</a>;
}
