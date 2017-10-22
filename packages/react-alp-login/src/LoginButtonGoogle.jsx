import { type Element } from 'react';
import Button from 'ynnub/components/Button';
import GoogleIcon from 'react-icons/lib/fa/google';

type PropsType = {
  label?: string,
};

export default ({ label = 'Login with Google', ...otherProps }: PropsType): Element<'a'> => (
  <Button href="/login/google" icon={<GoogleIcon />} label={label} {...otherProps} />
);
