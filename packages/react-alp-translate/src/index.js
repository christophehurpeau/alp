import { PropTypes } from 'react';

TranslateComponent.propTypes = {
    id: PropTypes.string,
};

TranslateComponent.contextTypes = {
    context: PropTypes.object.isRequired,
};

type Props = {
    id: string,
}

export default function TranslateComponent({ id, ...props }: Props, { context }) {
    return <span>{context.t(id)}</span>;
}
