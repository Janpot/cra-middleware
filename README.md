# cra-middleware

Run a create-react-app as a connect middleware.

This is mainly a proof of concept.

## Usage

1. Create an app with `create-react-app`.
2. Instantiate `cra-middleware` with the path to your app.

```js
const express = require('express');
const path = require('path');
const craMiddleware = require('./craMiddleware');

const app = express();
app.get('/api/hello', (req, res) => res.send('world'));
app.use('/', craMiddleware(path.resolve(__dirname, '../my-app')));
app.listen(3000);
```

## To Do

* Needs better interfacing with the subprocess. It would be nice to have some `ready`/`compile`/`error` events.
* Still seems to block node from cleanly exiting.
* Hooks?
* Logging options?
