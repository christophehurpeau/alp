// @ts-expect-error -- types are missing
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
          : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Change theme (currently: ${themeSetting.current || "none"})`
      }
      onPress={!isVisible ? undefined : themeSetting.toggle}
    />
  );
}
