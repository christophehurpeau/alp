import { createCheckPackageWithWorkspaces } from "check-package-dependencies";

await createCheckPackageWithWorkspaces({
  isLibrary: (pkg) => !pkg.name.endsWith("-example"),
})
  .checkRecommended({
    onlyWarnsForInMonorepoPackagesDependencies: {
      "alp-migrations": {
        "*": {
          duplicateDirectDependency: ["semver"],
        },
      },
    },
  })
  .run();
