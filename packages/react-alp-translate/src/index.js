import { PropTypes } from 'react';

TranslateComponent.propTypes = {
    id: PropTypes.string.isRequired,
};

TranslateComponent.contextTypes = {
    context: PropTypes.object.isRequired,
};

type Props = {
    id: string,
}

export default function TranslateComponent({ id, ...props }: Props, { context }) {
    return <span>{context.t(id, props)}</span>;
}
