import React, { ReactComponentElement } from 'react';
import { FaSlack } from 'react-icons/fa';
import Button, { ButtonProps } from 'ynnub/components/Button';

interface Props extends ButtonProps {
  label?: string;
}

export default ({
  label = 'Login with Slack',
  ...otherProps
}: Props): ReactComponentElement<'a'> => (
  <Button
    href="/login/slack"
    icon={<FaSlack />}
    label={label}
    {...otherProps}
  />
);
