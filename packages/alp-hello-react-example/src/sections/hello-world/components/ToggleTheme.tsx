import { useThemeSetting } from "@tamagui/next-theme";
import { useDidFinishSSR } from "@tamagui/use-did-finish-ssr";
import { Button } from "alouette";
import type { ReactNode } from "react";

export function ToggleTheme(): ReactNode {
  const isVisible = useDidFinishSSR();
  const themeSetting = useThemeSetting();

  return (
    <Button
      text={
        !isVisible
          ? "Loading..."
          : `Change theme (currently: ${themeSetting.current || "none"})`
      }
      onPress={!isVisible ? undefined : themeSetting.toggle}
    />
  );
}
