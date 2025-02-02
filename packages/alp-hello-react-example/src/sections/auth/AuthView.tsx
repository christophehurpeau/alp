import { Button, Stack, Typography, VStack } from "alouette";
import type { ReactNode } from "react";
import { useLoggedInUserState } from "react-alp-auth";
import { SlackLoginButton } from "./components/SlackTeamInstallButton";

interface AuthViewProps {
  serverAuthCookieValue?: string | null;
}

export function AuthView({ serverAuthCookieValue }: AuthViewProps): ReactNode {
  const { isLoggedIn, loggedInUserId } = useLoggedInUserState(
    serverAuthCookieValue || undefined,
  );

  if (isLoggedIn) {
    return (
      <VStack gap="$4">
        <Stack padding="$4">
          <Typography>Logged In User: {loggedInUserId}</Typography>
        </Stack>

        <Button
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          href={`${process.env.NEXT_PUBLIC_API_URL || "/api"}/logout`}
          text="Logout"
        />
      </VStack>
    );
  }

  return (
    <VStack gap="$4">
      <SlackLoginButton />
    </VStack>
  );
}
