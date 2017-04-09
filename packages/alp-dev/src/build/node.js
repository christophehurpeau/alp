import { createNodeCompiler } from '../webpack/node';

const nodeCompiler = createNodeCompiler(process.env.NODE_ENV === 'production');

nodeCompiler.run();
