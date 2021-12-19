import argv from 'minimist-argv';
import './configure-logger';
import { createModernBrowserCompiler, runDevServer } from './webpack/browser';

const browserCompiler = createModernBrowserCompiler(false);

runDevServer(browserCompiler, Number(argv.port), Number(argv['proxy-port']));
