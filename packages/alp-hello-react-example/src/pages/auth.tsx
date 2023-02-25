import type { GetServerSideProps } from 'next';
import type { ReactElement } from 'react';
import { getServerAuthCookieValue } from 'react-alp-auth';
import { AuthView } from 'sections/auth/AuthView';

interface AuthPageProps {
  serverAuthCookieValue?: string;
}

export default function AuthPage({
  serverAuthCookieValue,
}: AuthPageProps): ReactElement {
  return <AuthView serverAuthCookieValue={serverAuthCookieValue} />;
}

export const getServerSideProps: GetServerSideProps<AuthPageProps> = async (
  ctx,
) => ({
  props: {
    serverAuthCookieValue: getServerAuthCookieValue(ctx),
  },
});
