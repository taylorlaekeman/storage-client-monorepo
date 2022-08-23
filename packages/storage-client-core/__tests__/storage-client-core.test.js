'use strict';

const storageClientCore = require('..');
const assert = require('assert').strict;

assert.strictEqual(storageClientCore(), 'Hello from storageClientCore');
console.info("storageClientCore tests passed");
