/**
 * @param {import('next').NextConfig} overrideConfig
 * @return {import('next').NextConfig}
 */
export const createNextJsConfig = (overrideConfig) => ({
  // eslint code checking is done outside nextjs
  eslint: {
    ignoreDuringBuilds: true,
  },
  // typescript code checking is done outside nextjs
  typescript: {
    ignoreBuildErrors: true,
  },

  ...overrideConfig,

  webpack: (config, context) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
    };
    config.resolve.extensions = config.resolve.extensions.flatMap((ext) => [
      `.web${ext}`,
      ext,
    ]);

    if (overrideConfig.webpack) {
      config = overrideConfig.webpack(config, context);
    }

    return config;
  },
});
