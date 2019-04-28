import { hook, unhook } from './test/reporter.js';
import { test, run } from './test/runner.js';

setTimeout(async () => {
  await hook();
  await run();
  await unhook();
});

export { test };