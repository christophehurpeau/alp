import type { Stats } from "node:fs";
import { stat as fsStat, readdir } from "node:fs/promises";

export interface CallbackParam {
  filename: string;
  basedir: string;
  path: string;
  stat: Stats;
}

export default async function readRecursiveDirectory(
  directory: string,
  callback: (param: CallbackParam) => Promise<void> | void,
): Promise<void> {
  const files = await readdir(directory);

  await Promise.all(
    files.map(async (file): Promise<void> => {
      const path = `${directory}/${file}`;
      const stat = await fsStat(path);

      if (stat.isDirectory()) {
        await readRecursiveDirectory(path, callback);
        return;
      }
      await callback({
        filename: file,
        basedir: directory,
        path,
        stat,
      });
    }),
  );
}
