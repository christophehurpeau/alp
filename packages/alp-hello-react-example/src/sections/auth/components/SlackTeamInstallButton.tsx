import { Button } from "alouette";
import type { ReactNode } from "react";
import { AiFillSlackCircle as SlackIcon } from "react-icons/ai";

export function SlackLoginButton(): ReactNode {
  return (
    <Button
      // eslint-disable-next-line @typescript-eslint/no-deprecated
      href={`${process.env.NEXT_PUBLIC_API_URL || "/api"}/login/slack`}
      icon={<SlackIcon size={24} color="#ffffff" />}
      text="Log in with Slack"
    />
  );
}
