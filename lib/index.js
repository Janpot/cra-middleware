const Router = require('router');
const portfinder = require('portfinder');
const execa = require('execa');
const proxy = require('http-proxy-middleware');

function craMiddleware (craPath) {
  const router = new Router();
  let childProcess = null;
  let exitPromise = null;

  portfinder.getPort(function (err, port) {
    if (err) {
      router.use('/', (req, res, next) => next(err));
      return;
    }
    childProcess = execa('npm', [ 'run', '--silent', 'start' ], {
      cwd: craPath,
      env: {
        BROWSER: 'none',
        PORT: port
      }
    });
    // childProcess.stdout.pipe(process.stdout);
    exitPromise = new Promise(resolve => childProcess.once('exit', resolve));
    const proxyMiddleware = proxy({
      target: `http://localhost:${port}`,
      logLevel: 'silent',
      ws: true
    });
    router.use('/', proxyMiddleware);
  });

  async function quit () {
    childProcess.kill('SIGINT');
    await exitPromise;
  }

  router.quit = quit;

  return router;
}

module.exports = craMiddleware;
