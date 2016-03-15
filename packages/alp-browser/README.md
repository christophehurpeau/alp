# alp-browser

Framework based on ibex.
Alp requires node v5 or higher


```js
import Alp from 'alp-browser';

const app = new Alp();
await app.init();
app.servePublic();
app.catchErrors();
app.useRouter();
app.run();
```
