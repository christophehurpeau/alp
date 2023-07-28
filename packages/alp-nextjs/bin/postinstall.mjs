#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import util from 'node:util';
import sortKeys from 'sort-keys';

const currentPkg = JSON.parse(fs.readFileSync('./package.json'));
const pkg = { ...currentPkg };

if (!pkg.resolutions) pkg.resolutions = {};
if (!pkg.resolutionsExplained) pkg.resolutionsExplained = {};

pkg.resolutions = Object.fromEntries(
  Object.entries(pkg.resolutions).filter(([key]) => !key.startsWith('next@')),
);

pkg.resolutionsExplained = Object.fromEntries(
  Object.entries(pkg.resolutions).filter(([key]) => !key.startsWith('next@')),
);

const nextVersion = '13.1.6';
const patchFilename = 'next-npm-13.1.6-fb87a1424a.patch';

pkg.resolutions['next@13.1.6'] = `patch:next@npm%3A${nextVersion}#${
  pkg.name === 'alp' ? './packages/alp-nextjs/patches/' : './.yarn/patches/'
}${patchFilename}`;

pkg.resolutionsExplained['next@13.1.6'] =
  'Patch next to prevent it to change tsconfig.json';

sortKeys(pkg.resolutions);
sortKeys(pkg.resolutionsExplained);

if (
  true ||
  !util.isDeepStrictEqual(pkg.resolutions, currentPkg.resolutions) ||
  !util.isDeepStrictEqual(
    pkg.resolutionsExplained,
    currentPkg.resolutionsExplained,
  )
) {
  fs.writeFileSync('./package.json', `${JSON.stringify(pkg, null, 2)}\n`);

  if (pkg.name !== 'alp') {
    let foundPatch = false;
    try {
      fs.readdirSync('./.yarn/patches').forEach((filename) => {
        if (filename.startsWith('next-npm')) {
          if (filename === patchFilename) {
            foundPatch = true;
          } else {
            fs.unlinkSync(path.join('./.yarn/patches', filename));
          }
        }
      });
    } catch {}
    if (!foundPatch) {
      fs.mkdirSync('.yarn/patches', { recursive: true });
      fs.copyFileSync(
        `node_modules/alp-nextjs/patches/${patchFilename}`,
        `.yarn/patches/${patchFilename}`,
      );
    }
  }
}
