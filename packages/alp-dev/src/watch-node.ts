import argv from 'minimist-argv';
import { createNodeCompiler, watchAndRun } from './webpack/node';

const nodeCompiler = createNodeCompiler(false);

let watching = watchAndRun(nodeCompiler, argv.port);

process.on('SIGUSR2', () => {
  watching.close(() => {
    watching = watchAndRun(nodeCompiler, argv.port);
  });
});
