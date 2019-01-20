import argv from 'minimist-argv';
import { createModernBrowserCompiler, runDevServer } from './webpack/browser';

const browserCompiler = createModernBrowserCompiler(false);

runDevServer(browserCompiler, argv.port, argv['proxy-port'], {
  host: argv.host,
});
