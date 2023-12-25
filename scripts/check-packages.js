import { createCheckPackageWithWorkspaces } from 'check-package-dependencies';

await createCheckPackageWithWorkspaces({
  isLibrary: (pkg) => !pkg.name.endsWith('-example'),
})
  .checkRecommended({
    onlyWarnsForInMonorepoPackagesDependencies: {
      'alp-migrations': {
        '*': {
          duplicateDirectDependency: ['semver', 'nightingale-logger'],
        },
      },
      'alp-node-auth': {
        '*': {
          duplicateDirectDependency: ['nightingale-logger'],
        },
      },
      'alp-hello-react-example': {
        '*': {
          missingPeerDependency: ['react-native'],
        },
      },
    },
  })
  .run();
