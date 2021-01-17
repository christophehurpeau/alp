import { createNodeCompiler } from './webpack/node';

const nodeCompiler = createNodeCompiler(process.env.NODE_ENV === 'production');

// eslint-disable-next-line @typescript-eslint/no-floating-promises
nodeCompiler.run();
