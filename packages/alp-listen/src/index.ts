import { chmodSync, unlinkSync, readFileSync } from 'fs';
import { createServer as createServerHttp } from 'http';
import type { Server, IncomingMessage, ServerResponse } from 'http';
import { createServer as createServerHttps } from 'https';
import type { Config } from 'alp-node-config';
import { Logger } from 'nightingale-logger';

const logger = new Logger('alp:listen');

type RequestListener = (req: IncomingMessage, res: ServerResponse) => void;

const createServer = (
  callback: RequestListener,
  socketPath?: string,
  tls?: boolean,
  dirname = '',
): Server => {
  const createHttpServer =
    !socketPath && tls ? createServerHttps : createServerHttp;

  if (!tls) {
    return (createHttpServer as typeof createServerHttps)(callback);
  }

  const options = {
    key: readFileSync(`${dirname}/server.key`),
    cert: readFileSync(`${dirname}/server.crt`),
  };

  return (createHttpServer as typeof createServerHttps)(options, callback);
};

export default function alpListen(
  config: Config,
  callback: RequestListener,
  dirname?: string,
): Promise<Server> {
  return new Promise((resolve) => {
    const socketPath = config.get<string>('socketPath');
    const port = config.get<number>('port');
    const hostname = config.get<string>('hostname');
    const tls = config.get<boolean>('tls');

    logger.info('Creating server', socketPath ? { socketPath } : { port });
    const server = createServer(callback, socketPath, tls, dirname);

    if (socketPath) {
      try {
        unlinkSync(socketPath);
      } catch {}

      server.listen(socketPath, () => {
        if (socketPath) {
          chmodSync(socketPath, '777');
        }

        logger.info('Server listening', { socketPath });
        resolve(server);
      });
    } else {
      server.listen(port, hostname, () => {
        logger.info('Server listening', { port });
        resolve(server);
      });
    }
  });
}
