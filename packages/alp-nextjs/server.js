import { chmodSync, unlinkSync } from 'node:fs';
import { createServer } from 'node:http';
import next from 'next';

const socketPath = process.env.SOCKET_PATH;
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';

if (socketPath) {
  try {
    unlinkSync(socketPath);
  } catch {}
}

// Init the Next app
const app = next({ dev });

await app.prepare();

const server = createServer(app.getRequestHandler());
server.listen(socketPath || port, () => {
  chmodSync(socketPath, '777');
});

console.log(
  `> Server listening ${
    socketPath ? `to socket path ${socketPath}` : `at http://localhost:${port}`
  } as ${dev ? 'development' : process.env.NODE_ENV}`,
);

const cleanup = async () => {
  await app.close();
  server.close(() => {
    // eslint-disable-next-line unicorn/no-process-exit
    process.exit(0);
  });
};

process.on('SIGINT', () => cleanup());
process.on('SIGTERM', () => cleanup());
