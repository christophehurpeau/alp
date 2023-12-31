import { withTamagui } from '@tamagui/next-plugin';
import { createNextJsConfig } from 'alp-nextjs/createNextJsConfig';

const nextConfig = withTamagui({
  config: './src/tamagui.config.ts',
  components: ['tamagui'],
  // build-time generate CSS styles for better performance
  // we recommend only using this for production so you get reloading during dev mode
  outputCSS:
    process.env.NODE_ENV === 'production' ? './build/tamagui.css' : null,
})(
  createNextJsConfig({
    reactStrictMode: true,
    experimental: {
      esmExternals: true,
    },
    transpilePackages: [
      // requires react-native-web
      'alp-nextjs',
      'react-alp-connection-state',
    ],
  }),
);

if (process.env.TEST_BUILD_ID) {
  nextConfig.generateBuildId = () => process.env.TEST_BUILD_ID;
}

export default nextConfig;
