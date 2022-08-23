'use strict';

const storageClientFiledb = require('..');
const assert = require('assert').strict;

assert.strictEqual(storageClientFiledb(), 'Hello from storageClientFiledb');
console.info("storageClientFiledb tests passed");
