import { createRequire } from "node:module";

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
    config.resolve.extensions = config.resolve.extensions.flatMap((ext) => [
      `.web${ext}`,
      ext,
    ]);

    const analyseServer =
      context.isServer &&
      (process.env.BUNDLE_ANALYZE === "server" ||
        process.env.BUNDLE_ANALYZE === "both");
    const analyseClient =
      !context.isServer &&
      (process.env.BUNDLE_ANALYZE === "browser" ||
        process.env.BUNDLE_ANALYZE === "both");
    if (analyseServer || analyseClient) {
      const require = createRequire(import.meta.url);

      // eslint-disable-next-line import/no-extraneous-dependencies
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static", // 'server'
          analyzerPort: context.isServer ? 8888 : 8889,
          openAnalyzer: true,
          reportFilename: `./bundles/${
            context.isServer ? "server" : "browser"
          }.html`,
        }),
      );
    }

    if (overrideConfig.webpack) {
      config = overrideConfig.webpack(config, context);
    }

    return config;
  },
});

/**
 * @param {import('next').NextConfig} overrideConfig
 * @return {import('next').NextConfig}
 */
export const createNextJsStaticExportConfig = (overrideConfig) =>
  createNextJsConfig({
    ...overrideConfig,
    output: "export",
  });
