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

addConfig(
  {
    pattern: /^alp-dev/,
    handler: new ConsoleLogger(Level.INFO),
    stop: true,
  },
  true,
);
