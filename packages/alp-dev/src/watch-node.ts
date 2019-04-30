import argv from 'minimist-argv';
import { configure, Level } from 'nightingale';
import ConsoleLogger from 'nightingale-console';
import { createNodeCompiler, watchAndRun } from './webpack/node';

configure([
  {
    pattern: /^springbokjs-daemon/,
    handler: new ConsoleLogger(Level.NOTICE),
    stop: true,
  },
]);

const nodeCompiler = createNodeCompiler(false);

let watching = watchAndRun(nodeCompiler, argv.port);

process.on('SIGUSR2', () => {
  watching.close(() => {
    watching = watchAndRun(nodeCompiler, argv.port);
  });
});
