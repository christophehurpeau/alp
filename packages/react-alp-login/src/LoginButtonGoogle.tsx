import React, { ReactComponentElement } from 'react';
import { FaGoogle } from 'react-icons/fa';
import Button, { ButtonProps } from 'ynnub/components/Button';

interface Props extends ButtonProps {
  label?: ButtonProps['label'];
}

export default ({
  label = 'Login with Google',
  ...otherProps
}: Props): ReactComponentElement<'a'> => (
  <Button
    href="/login/google"
    icon={<FaGoogle />}
    label={label}
    {...otherProps}
  />
);
