import { ConsoleLogger, LogLevel } from 'nightingale';

export default function aukLogger(app) {
    const logConfig = app.config.get('log');
    app.logger = new ConsoleLogger('app', logConfig && logConfig.level || LogLevel.ALL);
}
