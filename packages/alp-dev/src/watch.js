import { node as nodeDaemon } from 'springbokjs-daemon/src';
import './server';

nodeDaemon([
  require.resolve('./browser-sync'),
  ...process.argv.slice(2),
]).start();
