'use strict';

const storageClientTest = require('..');
const assert = require('assert').strict;

assert.strictEqual(storageClientTest(), 'Hello from storageClientTest');
console.info("storageClientTest tests passed");
