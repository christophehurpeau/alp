import Application from 'koa';
declare module 'koa' {
    interface Request {
        body: any;
    }
    interface BaseContext {
        parseBody: () => Promise<void>;
        parseBodyJson: () => Promise<void>;
        parseBodyText: () => Promise<void>;
    }
}
export default function alpBodyParser(app: Application): void;
//# sourceMappingURL=index.d.ts.map