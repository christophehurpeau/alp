import { createCheckPackageWithWorkspaces } from "check-package-dependencies";

await createCheckPackageWithWorkspaces({
  isLibrary: (pkg) => !pkg.name.endsWith("-example"),
})
  .checkRecommended({
    onlyWarnsForInMonorepoPackagesDependencies: {
      "alp-migrations": {
        "*": {
          duplicateDirectDependency: ["nightingale-logger"],
        },
      },
      "alp-node-auth": {
        "*": {
          duplicateDirectDependency: ["nightingale-logger"],
        },
      },
    },
  })
  .run();
