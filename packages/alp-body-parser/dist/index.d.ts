import Application from 'koa';
declare module 'koa' {
    interface Request {
        body: any;
    }
    interface BaseContext {
        parseBody: <T>() => Promise<T>;
        parseBodyJson: <T>() => Promise<T>;
        parseBodyText: <T>() => Promise<T>;
    }
}
export default function alpBodyParser(app: Application): void;
//# sourceMappingURL=index.d.ts.map