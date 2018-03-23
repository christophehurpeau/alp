import argv from 'minimist-argv';
import { createNodeCompiler, watchAndRun } from './webpack/node';

const nodeCompiler = createNodeCompiler();

watchAndRun(nodeCompiler, argv.port);
