export const SET_NAME = 'SET_NAME';

export function setName(name) {
    console.log(name);
    return {
        type: SET_NAME,
        name: name,
    };
}
