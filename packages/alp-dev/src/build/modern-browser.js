import { createModernBrowserCompiler } from '../webpack/browser';

const browserCompiler = createModernBrowserCompiler(process.env.NODE_ENV === 'production');

browserCompiler.run();
