import type { ReactElement } from 'react';
import { useLoggedInUserState } from 'react-alp-auth';
import { Button, Text, YStack, Stack } from 'tamagui';
import { SlackLoginButton } from './components/SlackTeamInstallButton';

interface AuthViewProps {
  serverAuthCookieValue?: string | null;
}

export function AuthView({
  serverAuthCookieValue,
}: AuthViewProps): ReactElement {
  const { isLoggedIn, loggedInUserId } = useLoggedInUserState(
    serverAuthCookieValue || undefined,
  );

  if (isLoggedIn) {
    return (
      <YStack space="md">
        <Stack padding="$4">
          <Text>Logged In User: {loggedInUserId}</Text>
        </Stack>

        <Button href={`${process.env.NEXT_PUBLIC_API_URL || '/api'}/logout`}>
          <Text>Logout</Text>
        </Button>
      </YStack>
    );
  }

  return (
    <YStack space="md">
      <SlackLoginButton />
    </YStack>
  );
}
