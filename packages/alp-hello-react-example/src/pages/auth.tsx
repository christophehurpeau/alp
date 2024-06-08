import type { GetServerSideProps } from "next";
import type { ReactElement } from "react";
import { getServerAuthCookieValue } from "react-alp-auth";
import { AuthView } from "sections/auth/AuthView";

interface AuthPageProps {
  serverAuthCookieValue: string | null;
}

export default function AuthPage({
  serverAuthCookieValue,
}: AuthPageProps): ReactElement {
  return <AuthView serverAuthCookieValue={serverAuthCookieValue} />;
}

export const getServerSideProps: GetServerSideProps<AuthPageProps> = async (
  ctx,
  // eslint-disable-next-line @typescript-eslint/require-await
) => ({
  props: {
    serverAuthCookieValue: getServerAuthCookieValue(ctx),
  },
});
