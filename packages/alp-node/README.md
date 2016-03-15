# alp-node

Framework based on koa 2.
Alp requires node v5 or higher


```js
import Alp from 'alp-node';

const app = new Alp();
app.servePublic();
app.catchErrors();
app.useRouter();
app.listen();
```
