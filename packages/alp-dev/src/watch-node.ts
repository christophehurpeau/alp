import argv from 'minimist-argv';
import './configure-logger';
import { createNodeCompiler, watchAndRun } from './webpack/node';

const nodeCompiler = createNodeCompiler(false);
const port = Number(argv.port);

let watching = watchAndRun(nodeCompiler, port);

process.on('SIGUSR2', () => {
  watching.close(() => {
    watching = watchAndRun(nodeCompiler, port);
  });
});
