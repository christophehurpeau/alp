import argv from 'minimist-argv';
import { configure, Level } from 'nightingale';
import ConsoleLogger from 'nightingale-console';
import { createModernBrowserCompiler, runDevServer } from './webpack/browser';

const browserCompiler = createModernBrowserCompiler(false);

configure([
  {
    pattern: /^springbokjs-daemon/,
    handler: new ConsoleLogger(Level.NOTICE),
    stop: true,
  },
]);

runDevServer(browserCompiler, argv.port, argv['proxy-port'], {
  host: argv.host,
});
