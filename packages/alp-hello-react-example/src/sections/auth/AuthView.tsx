import { Button, Text, VStack } from 'native-base';
import type { ReactElement } from 'react';
import { useLoggedInUserState } from 'react-alp-auth';
import { SlackLoginButton } from './components/SlackTeamInstallButton';

interface AuthViewProps {
  serverAuthCookieValue?: string;
}

export function AuthView({
  serverAuthCookieValue,
}: AuthViewProps): ReactElement {
  const { isLoggedIn, loggedInUserId } = useLoggedInUserState(
    serverAuthCookieValue,
  );

  if (isLoggedIn) {
    return (
      <VStack space="md">
        <Text>Logged In User: {loggedInUserId}</Text>

        <Button
          href={`${process.env.NEXT_PUBLIC_API_URL || '/api'}/logout`}
          variant="solid"
        >
          <Text>Logout</Text>
        </Button>
      </VStack>
    );
  }

  return (
    <VStack space="md">
      <SlackLoginButton />
    </VStack>
  );
}
