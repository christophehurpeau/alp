# alp-body-parser

```js
import Koa from 'koa';
import config from 'alp-config';
import bodyParser from 'alp-body-parser';

const app = new Koa();
config(`${__dirname}/config`, { packageConfig })(app);
bodyParser(app);
```

```js
import newController from 'alp-controller';

export default newController({
    async form(ctx) {
        const body = await ctx.parseBody();
    },

    async json(ctx) {
        const body = await ctx.parseBodyJson();
    },

    async text(ctx) {
        const body = await ctx.parseBodyText();
    },
});
