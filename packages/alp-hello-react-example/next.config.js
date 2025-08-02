import { withTamagui } from "@tamagui/next-plugin";
import { createNextJsConfig } from "alp-nextjs/createNextJsConfig";

const nextConfig = withTamagui({
  config: "./src/tamagui.config.ts",
  components: ["alouette"],
  // build-time generate CSS styles for better performance
  // we recommend only using this for production so you get reloading during dev mode
  outputCSS:
    process.env.NODE_ENV === "production" ? "./build/tamagui.css" : null,
  disableExtraction: process.env.NODE_ENV !== "production",
})(
  createNextJsConfig({
    reactStrictMode: true,
    transpilePackages: [
      // requires react-native-web
      "alp-nextjs",
      "react-alp-connection-state",
      "alouette",
      "alouette-icons",
    ],
    webpack: (config) => {
      const fileLoaderRule = config.module.rules.find((rule) =>
        rule.test?.test?.(".svg"),
      );

      config.module.rules.push(
        {
          ...fileLoaderRule,
          test: /\.svg$/i,
          resourceQuery: /url/,
        },

        {
          test: /\.svg$/i,
          issuer: fileLoaderRule.issuer,
          resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
          use: [
            {
              loader: "@svgr/webpack",
              options: { svgo: false, exportType: "named" },
            },
          ],
        },
      );

      fileLoaderRule.exclude = /\.svg$/i;

      return config;
    },
  }),
);

if (process.env.TEST_BUILD_ID) {
  nextConfig.generateBuildId = () => process.env.TEST_BUILD_ID;
}

export default nextConfig;
