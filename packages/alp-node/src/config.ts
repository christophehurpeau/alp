import { existsSync, readFileSync } from "node:fs";
import deepFreeze from "deep-freeze-es6";
import minimist from "minimist";
import type { NodeConfig, PackageConfig } from "./types";

const argv = minimist(process.argv.slice(2));

function _existsConfigSync(dirname: string, name: string): boolean {
  return existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(
  dirname: string,
  name: string,
): Record<string, unknown> {
  const content = readFileSync(`${dirname}${name}.json`, "utf8");
  return JSON.parse(content) as Record<string, unknown>;
}

export interface ConfigOptions {
  argv?: string[];
  packageConfig?: PackageConfig;
  version?: string;
}

export class Config {
  packageConfig?: PackageConfig;

  private _record: Record<string, unknown>;

  private readonly _dirname: string;

  constructor(dirname: string, options?: ConfigOptions) {
    this._record = {};
    this._dirname = dirname.replace(/\/*$/, "/");
    if (options) {
      this.loadSync(options);
    }
  }

  loadSync(options: ConfigOptions = {}): Config & NodeConfig {
    const env = process.env.CONFIG_ENV || process.env.NODE_ENV || "development";
    const { argv: argvOverrides = [], packageConfig, version } = options;
    this.packageConfig = packageConfig;

    const config = _loadConfigSync(this._dirname, "common");
    for (const [key, value] of Object.entries(
      _loadConfigSync(this._dirname, env),
    )) {
      config[key] = value;
    }

    if (this.existsConfigSync("local")) {
      for (const [key, value] of Object.entries(
        _loadConfigSync(this._dirname, "local"),
      )) {
        config[key] = value;
      }
    }

    if (config.version) {
      throw new Error('Cannot have "version", in config.');
    }

    config.version = String(version || argv.version || packageConfig?.version);

    const socketPath: string | undefined = (argv.socket ||
      argv["socket-path"] ||
      argv.socketPath) as string | undefined;
    if (socketPath) {
      config.socketPath = socketPath;
    } else if (argv.port) {
      config.port = argv.port;
      delete config.socketPath;
    } else if (process.env.PORT) {
      config.port = Number(process.env.PORT);
      delete config.socketPath;
    }

    argvOverrides.forEach((key) => {
      const splitted = key.split(".");
      const value =
        splitted.length > 0 &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,unicorn/no-array-reduce
        splitted.reduce((config, partialKey) => config[partialKey], argv);
      if (value !== undefined) {
        const last = splitted.pop()!;
        const v =
          splitted.length === 0
            ? config
            : // eslint-disable-next-line unicorn/no-array-reduce
              splitted.reduce(
                (config, partialKey) =>
                  config[partialKey] as Record<string, unknown>,
                config,
              );
        v[last] = value;
      }
    });

    this._record = deepFreeze(config);
    return this as unknown as Config & NodeConfig;
  }

  get<T>(key: string): Readonly<T> {
    return this._record[key] as T;
  }

  existsConfigSync(name: string): boolean {
    return _existsConfigSync(this._dirname, name);
  }

  loadConfigSync(name: string): Readonly<Record<string, unknown>> {
    return _loadConfigSync(this._dirname, name);
  }
}
