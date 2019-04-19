import React, { Component } from 'react';
interface Props {
    value: undefined | string;
    onChange: (name: string) => void;
}
export default class InputNameComponent extends Component<Props> {
    state: {
        value: string | undefined;
    };
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleKeyUp: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    render(): JSX.Element;
}
export {};
//# sourceMappingURL=InputNameComponent.d.ts.map