import type { ReactElement } from "react";
import { AiFillSlackCircle as SlackIcon } from "react-icons/ai";
import { Button, Text } from "tamagui";

export function SlackLoginButton(): ReactElement {
  return (
    <Button
      href={`${process.env.NEXT_PUBLIC_API_URL || "/api"}/login/slack`}
      icon={<SlackIcon size={24} color="#ffffff" />}
    >
      <Text color="text.50">Log in with Slack</Text>
    </Button>
  );
}
