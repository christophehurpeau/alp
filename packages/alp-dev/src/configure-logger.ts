import { addConfig, Level } from 'nightingale';
import ConsoleLogger from 'nightingale-console';

addConfig(
  {
    pattern: /^springbokjs-daemon/,
    handler: new ConsoleLogger(Level.NOTICE),
    stop: true,
  },
  true,
);
