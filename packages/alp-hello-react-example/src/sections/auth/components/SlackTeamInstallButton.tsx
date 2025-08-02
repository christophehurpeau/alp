import { InternalLinkButton } from "alouette";
import { SlackLogoFillIcon } from "alouette-icons/phosphor-icons";
import type { ReactNode } from "react";

export function SlackLoginButton(): ReactNode {
  return (
    <InternalLinkButton
      href={`${process.env.NEXT_PUBLIC_API_URL || "/api"}/login/slack`}
      icon={<SlackLogoFillIcon />}
      text="Log in with Slack"
    />
  );
}
