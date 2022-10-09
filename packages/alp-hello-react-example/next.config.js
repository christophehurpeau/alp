import withPlugins from 'next-compose-plugins';
import withTM from 'next-transpile-modules';
// import yoRcConfig from '../../.yo-rc.json';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // eslint code checking is done outside nextjs
  eslint: {
    ignoreDuringBuilds: true,
  },
  // typescript code checking is done outside nextjs
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    esmExternals: true,
    images: {
      unoptimized: true,
    },
  },
  webpack: (config, context) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = config.resolve.extensions.flatMap((ext) => [
      `.web${ext}`,
      ext,
    ]);

    return config;
  },
};

export default withPlugins(
  [
    withTM([
      // native-base - https://github.com/GeekyAnts/nativebase-templates/blob/master/nextjs-with-native-base/next.config.js
      'native-base',
      'react-native-svg',
      'react-native-web',
      'react-native-safe-area-context',
      '@react-aria/visually-hidden',
      '@react-native-aria/button',
      '@react-native-aria/checkbox',
      '@react-native-aria/combobox',
      '@react-native-aria/focus',
      '@react-native-aria/interactions',
      '@react-native-aria/listbox',
      '@react-native-aria/overlays',
      '@react-native-aria/radio',
      '@react-native-aria/slider',
      '@react-native-aria/tabs',
      '@react-native-aria/utils',
      '@react-stately/combobox',
      '@react-stately/radio',

      // requires react-native-web
      'react-alp-connection-state',
    ]),
  ],
  nextConfig,
);
