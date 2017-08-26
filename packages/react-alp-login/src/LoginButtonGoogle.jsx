import Button from 'ynnub/components/Button';
import GoogleIcon from 'react-icons/lib/fa/google';

type PropsType = {
  label: ?string,
};

export default ({ label, ...otherProps }: PropsType) =>
  <Button
    href="/login/google"
    icon={<GoogleIcon className="icon" />}
    label={label || 'Login with Google'}
    {...otherProps}
  />;
