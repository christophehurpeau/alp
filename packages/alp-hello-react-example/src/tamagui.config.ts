import { createMedia } from '@tamagui/react-native-media-driver';
// import { shorthands } from '@tamagui/shorthands';
import { themes, tokens } from '@tamagui/themes';
import { createFont, createTamagui } from 'tamagui';

export default createTamagui({
  allowedStyleValues: 'strict-web',
  themes,
  tokens,
  // shorthands,
  fonts: {
    body: createFont({
      family: 'Arial',
      size: {
        true: 14,
        // You'll want to fill these values in so you can use them
        // for now, fontSize="$4" will be 14px.
        // You can define different keys, but `tamagui`
        // standardizes on 1-15.
        4: 14,
        6: 16,
      },
      lineHeight: {
        true: 16,
        4: 16,
        6: 18,
      },
      fontStyle: {
        true: 'normal',
      },
    }),
  },
  media: createMedia({
    md: { minWidth: 980 },
    // ...
  }),
});
