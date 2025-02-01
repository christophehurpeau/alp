import type { ReactNode } from "react";
import { useLoggedInUserState } from "react-alp-auth";
import { Button, Stack, Text, YStack } from "tamagui";
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
      <YStack gap="$md">
        <Stack padding="$4">
          <Text>Logged In User: {loggedInUserId}</Text>
        </Stack>

        <Button
          // eslint-disable-next-line @typescript-eslint/no-deprecated
          href={`${process.env.NEXT_PUBLIC_API_URL || "/api"}/logout`}
        >
          <Text>Logout</Text>
        </Button>
      </YStack>
    );
  }

  return (
    <YStack gap="$md">
      <SlackLoginButton />
    </YStack>
  );
}
