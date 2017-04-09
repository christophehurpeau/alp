import { createOlderBrowserCompiler } from '../webpack/browser';

const browserCompiler = createOlderBrowserCompiler(process.env.NODE_ENV === 'production');

browserCompiler.run();
