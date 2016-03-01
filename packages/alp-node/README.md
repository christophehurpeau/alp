# auk

Framework based on koa 2.
Auk requires node v5 or higher


```js
import Auk from 'auk';

const app = new Auk(__dirname);
app.servePublic();
app.catchErrors();
app.useRouter();
app.listen();
```
