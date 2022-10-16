import { createCheckPackageWithWorkspaces } from 'check-package-dependencies';

createCheckPackageWithWorkspaces().checkRecommended({
  isLibrary: (pkgName) => !pkgName.endsWith('-example'),
  onlyWarnsForInMonorepoPackagesDependencies: {
    'alp-migrations': {
      '*': {
        duplicateDirectDependency: ['semver'],
      },
    },
    'alp-hello-react-example': {
      '*': {
        missingPeerDependency: ['react-native'],
        invalidPeerDependencyVersion: ['typescript'], // TODO to fix
      },
    },
  },
});
