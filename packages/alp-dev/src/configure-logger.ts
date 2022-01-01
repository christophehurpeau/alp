import { addConfig, Level } from 'nightingale';
import { ConsoleHandler } from 'nightingale-console';

addConfig(
  {
    pattern: /^springbokjs-daemon/,
    handler: new ConsoleHandler(Level.NOTICE),
    stop: true,
  },
  true,
);
