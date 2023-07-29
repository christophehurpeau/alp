import { useThemeSetting } from '@tamagui/next-theme';
import type { FC } from 'react';
import { Button, useDidFinishSSR } from 'tamagui';

export const ToggleTheme: FC = () => {
  const isVisible = useDidFinishSSR();
  const themeSetting = useThemeSetting();

  return (
    <Button onPress={!isVisible ? undefined : themeSetting.toggle}>
      {!isVisible
        ? 'Loading...'
        : `Change theme (currently: ${themeSetting.current || 'none'})`}
    </Button>
  );
};
