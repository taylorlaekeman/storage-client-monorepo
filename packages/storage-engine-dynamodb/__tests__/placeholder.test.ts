import { expect, test } from '@jest/globals';

import log from '@src/log';

test('placeholder', () => {
  log();
  expect(true).toBe(true);
});
