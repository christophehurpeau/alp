import { type Element } from 'react';
import Button from 'ynnub/components/Button';

type PropsType = {
  label?: string,
};

export default ({ label = 'Login with Google', ...otherProps }: PropsType): Element<'a'> => (
  <Button href="/login/google" icon="google" label={label} {...otherProps} />
);
