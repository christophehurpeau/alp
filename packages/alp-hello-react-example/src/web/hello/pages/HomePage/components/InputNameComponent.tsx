import React, { ChangeEvent, Component, KeyboardEvent } from 'react';
import Input from 'ynnub/form/InputText';
import s from './InputNameComponent.scss';

interface Props {
  value: undefined | string;
  onChange: (name: string) => void;
}

export default class InputNameComponent extends Component<Props> {
  state = {
    value: this.props.value,
  };

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('handleChange');
    this.setState({ value: e.target.value });
    this.props.onChange(e.target.value);
  };

  handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log('handleKeyUp');
    this.props.onChange(e.currentTarget.value);
  };

  render() {
    console.log('render InputNameComponent');
    return (
      <Input
        id="input-name"
        type="text"
        autoComplete="off"
        className={s.input}
        value={this.state.value}
        onChange={this.handleChange}
        onKeyUp={this.handleKeyUp}
      />
    );
  }
}