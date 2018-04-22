/* eslint-env mocha */

const express = require('express');
const portfinder = require('portfinder');
const path = require('path');
const craMiddleware = require('..');
const fetch = require('node-fetch');
const { promisify } = require('util');
const { assert } = require('chai');

const timeoutPromise = promisify(setTimeout);

async function listen (app, port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, error => {
      if (error) {
        return reject(error);
      }
      resolve(server);
    });
  });
}

async function close (server) {
  return promisify(server.close.bind(server))();
}

describe('craMiddleware', () => {
  it('starts cra dev server', async function () {
    this.timeout(60000);
    const app = express();
    const freePort = await portfinder.getPortPromise();
    const server = await listen(app, freePort);
    const middleware = craMiddleware(path.resolve(__dirname, './test-app'));
    app.use('/', middleware);
    await timeoutPromise(3000);
    try {
      const response = await fetch(`http://localhost:${freePort}/`);
      assert.propertyVal(response, 'status', 200);
    } finally {
      await close(server);
      await middleware.quit();
    }
  });
});
