import { useThemeSetting } from "@tamagui/next-theme";
import type { ReactNode } from "react";
import { Button, useDidFinishSSR } from "tamagui";

export function ToggleTheme(): ReactNode {
  const isVisible = useDidFinishSSR();
  const themeSetting = useThemeSetting();

  return (
    <Button onPress={!isVisible ? undefined : themeSetting.toggle}>
      {!isVisible
        ? "Loading..."
        : `Change theme (currently: ${themeSetting.current || "none"})`}
    </Button>
  );
}
