const helper = require('fastify-cli/helper.js');
import * as path from 'path';
import * as tap from 'tap';

export type Test = typeof tap['Test']['prototype'];

const AppPath = path.join(__dirname, '..', 'src', 'app.ts');

async function config() {
  return {};
}

async function build(t: Test) {
  const argv = [AppPath];

  const app = await helper.build(argv, await config());

  t.teardown(() => void app.close());

  return app;
}

export { config, build };
