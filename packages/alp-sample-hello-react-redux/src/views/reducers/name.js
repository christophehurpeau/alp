import { createReducer } from 'alp-react-redux';
import { setName } from '../actions/name';

export default createReducer(() => '', {
    [setName]: (state, { name }: { name: string }): string => name,
});
