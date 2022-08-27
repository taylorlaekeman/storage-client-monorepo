import StorageEngine from '@src/storageEngine';

test('describes table specified in initial configuration', async () => {
  const engine = new StorageEngine({
    tables: {
      'test-table': {
        hashKey: 'hashKey',
        sortKey: 'sortKey',
      },
    },
  });
  const description = await engine.describeTable({ tableName: 'test-table' });
  expect(description).toMatchObject({
    hashKey: 'hashKey',
    sortKey: 'sortKey',
  });
});

test('retrives item with simple (hash) key specified in initial configuration', async () => {
  const engine = new StorageEngine({
    tables: {
      'test-table': {
        hashKey: 'hashKey',
        items: { 'test-hash-key': { hashKey: 'test-hash-key' } },
      },
    },
  });
  const items = await engine.getItems({
    hashKeyName: 'hashKey',
    hashKeyValue: 'test-hash-key',
    tableName: 'test-table',
  });
  expect(items).toMatchObject([{ hashKey: 'test-hash-key' }]);
});

test('retrives item with composite (hash and sort) key specified in initial configuration', async () => {
  const engine = new StorageEngine({
    tables: {
      'test-table': {
        hashKey: 'hashKey',
        items: {
          'test-hash-key': {
            'test-sort-key': {
              hashKey: 'test-hash-key',
              sortKey: 'test-sort-key',
            },
          },
        },
        sortKey: 'sortKey',
      },
    },
  });
  const items = await engine.getItems({
    hashKeyName: 'hashKey',
    hashKeyValue: 'test-hash-key',
    tableName: 'test-table',
  });
  expect(items).toMatchObject([
    { hashKey: 'test-hash-key', sortKey: 'test-sort-key' },
  ]);
});
