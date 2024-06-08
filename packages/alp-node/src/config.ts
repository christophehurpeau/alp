import { existsSync, readFileSync } from "node:fs";
import deepFreeze from "deep-freeze-es6";
import minimist from "minimist";
import parseJSON from "parse-json-object-as-map";
import type { NodeApplication, NodeConfig, PackageConfig } from "./types";

const argv = minimist(process.argv.slice(2));

function _existsConfigSync(dirname: string, name: string): boolean {
  return existsSync(`${dirname}${name}.json`);
}

function _loadConfigSync(dirname: string, name: string): Map<string, unknown> {
  const content = readFileSync(`${dirname}${name}.json`, "utf8");
  return parseJSON(content) as Map<string, unknown>;
}

export interface ConfigOptions {
  argv?: string[];
  packageConfig?: PackageConfig;
  version?: string;
}

export class Config {
  packageConfig?: PackageConfig;

  private _map: Map<string, unknown>;

  private readonly _dirname: string;

  constructor(dirname: string, options?: ConfigOptions) {
    this._map = new Map<string, unknown>();
    this._dirname = dirname.replace(/\/*$/, "/");
    if (options) {
      this.loadSync(options);
    }
  }

  loadSync(options: ConfigOptions = {}): Config & NodeConfig {
    const env = process.env.CONFIG_ENV || process.env.NODE_ENV || "development";
    const { argv: argvOverrides = [], packageConfig, version } = options;
    this.packageConfig = packageConfig;

    const config = this.loadConfigSync("common") as Map<string, unknown>;
    for (const [key, value] of this.loadConfigSync(env)) {
      config.set(key, value);
    }

    if (this.existsConfigSync("local")) {
      for (const [key, value] of this.loadConfigSync("local")) {
        config.set(key, value);
      }
    }

    if (config.has("version")) {
      throw new Error('Cannot have "version", in config.');
    }

    config.set(
      "version",
      String(version || argv.version || packageConfig?.version),
    );

    const socketPath: string | undefined = (argv.socket ||
      argv["socket-path"] ||
      argv.socketPath) as string | undefined;
    if (socketPath) {
      config.set("socketPath", socketPath);
    } else if (argv.port) {
      config.set("port", argv.port);
      config.delete("socketPath");
    } else if (process.env.PORT) {
      config.set("port", Number(process.env.PORT));
      config.delete("socketPath");
    }

    argvOverrides.forEach((key) => {
      const splitted = key.split(".");
      const value =
        splitted.length > 0 &&
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return,unicorn/no-array-reduce
        splitted.reduce((config, partialKey) => config[partialKey], argv);
      if (value !== undefined) {
        const last = splitted.pop()!;
        const map =
          splitted.length === 0
            ? config
            : // eslint-disable-next-line unicorn/no-array-reduce
              splitted.reduce(
                (config, partialKey) =>
                  config.get(partialKey) as Map<string, unknown>,
                config,
              );
        map.set(last, value);
      }
    });

    this._map = deepFreeze(config);
    return this as Config & NodeConfig;
  }

  get<T>(key: string): T {
    return this._map.get(key) as T;
  }

  existsConfigSync(name: string): boolean {
    return _existsConfigSync(this._dirname, name);
  }

  loadConfigSync(name: string): ReadonlyMap<string, unknown> {
    return _loadConfigSync(this._dirname, name);
  }
}

export default function getConfig(
  app: NodeApplication,
  config: Config & NodeConfig,
): Config & NodeConfig {
  return config;
}
