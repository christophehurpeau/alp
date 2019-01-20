import { ReactElement } from 'react';
import { FaGoogle } from 'react-icons/fa';
import Button, { ButtonProps } from 'ynnub/components/Button';

interface Props extends ButtonProps {
  label?: string;
}

export default ({
  label = 'Login with Google',
  ...otherProps
}: Props): ReactElement<'a'> => (
  <Button
    href="/login/google"
    icon={<FaGoogle />}
    label={label}
    {...otherProps}
  />
);
