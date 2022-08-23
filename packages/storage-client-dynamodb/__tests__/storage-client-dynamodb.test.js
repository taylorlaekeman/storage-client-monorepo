'use strict';

const storageClientDynamodb = require('..');
const assert = require('assert').strict;

assert.strictEqual(storageClientDynamodb(), 'Hello from storageClientDynamodb');
console.info("storageClientDynamodb tests passed");
