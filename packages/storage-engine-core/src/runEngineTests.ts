import ExistingTableError from '@src/existingTableError';
import MissingKeyError from '@src/missingKeyError';
import MissingTableError from '@src/missingTableError';
import type StorageEngine from '@src/storageEngine';

const runEngineTests = ({ getEngine }: { getEngine: () => StorageEngine }) => {
  test('creates and describes table with sort key', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
      tableName: 'test-table',
    });
    const result = await engine.describeTable({ tableName: 'test-table' });
    expect(result).toMatchObject({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
    });
  });

  test('creates and describes table without sort key', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName: 'test-table',
    });
    const result = await engine.describeTable({ tableName: 'test-table' });
    expect(result).toMatchObject({
      hashKey: 'hashKey',
    });
  });

  test('adds items to and gets items from table with sort key', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
      tableName: 'test-table',
    });
    const sharedProperties = {
      booleanProperty: true,
      hashKey: 'test-hash-key',
      numericProperty: 9,
      stringProperty: 'test-value',
    };
    const firstReturnedItem = await engine.addItem({
      item: { ...sharedProperties, sortKey: 'test-sort-key-1' },
      tableName: 'test-table',
    });
    const secondReturnedItem = await engine.addItem({
      item: { ...sharedProperties, sortKey: 'test-sort-key-2' },
      tableName: 'test-table',
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName: 'test-table',
    });
    expect(firstReturnedItem).toMatchObject({
      ...sharedProperties,
      sortKey: 'test-sort-key-1',
    });
    expect(secondReturnedItem).toMatchObject({
      ...sharedProperties,
      sortKey: 'test-sort-key-2',
    });
    expect(retrievedItems).toMatchObject([
      { ...sharedProperties, sortKey: 'test-sort-key-1' },
      { ...sharedProperties, sortKey: 'test-sort-key-2' },
    ]);
  });

  test('adds item to and gets item from table without sort key', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName: 'test-table',
    });
    const item = {
      booleanProperty: true,
      hashKey: 'test-hash-key',
      numericProperty: 9,
      stringProperty: 'test-value',
    };
    const returnedItem = await engine.addItem({
      item,
      tableName: 'test-table',
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName: 'test-table',
    });
    expect(returnedItem).toMatchObject(item);
    expect(retrievedItems).toMatchObject([item]);
  });

  test('overwrites item with matching simple (hash) key', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName: 'test-table',
    });
    const firstItem = {
      booleanProperty: true,
      hashKey: 'test-hash-key',
      numericProperty: 9,
      stringProperty: 'test-value',
    };
    const secondItem = {
      booleanProperty: false,
      hashKey: 'test-hash-key',
      numericProperty: 11,
      stringProperty: 'test-new-value',
    };
    await engine.addItem({
      item: firstItem,
      tableName: 'test-table',
    });
    await engine.addItem({
      item: secondItem,
      tableName: 'test-table',
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName: 'test-table',
    });
    expect(retrievedItems).toMatchObject([secondItem]);
  });

  test('overwrites item with matching composite (hash and sort) key', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
      tableName: 'test-table',
    });
    const firstItem = {
      booleanProperty: true,
      hashKey: 'test-hash-key',
      numericProperty: 9,
      stringProperty: 'test-value',
      sortKey: 'test-sort-key',
    };
    const secondItem = {
      booleanProperty: false,
      hashKey: 'test-hash-key',
      numericProperty: 11,
      stringProperty: 'test-new-value',
      sortKey: 'test-sort-key',
    };
    await engine.addItem({
      item: firstItem,
      tableName: 'test-table',
    });
    await engine.addItem({
      item: secondItem,
      tableName: 'test-table',
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName: 'test-table',
    });
    expect(retrievedItems).toMatchObject([secondItem]);
  });

  test('gets empty list when no items match key', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName: 'test-table',
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName: 'test-table',
    });
    expect(retrievedItems).toMatchObject([]);
  });

  test('throws existing table error when creating a table that already exists', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName: 'test-table',
    });
    await expect(
      engine.createTable({
        hashKey: 'hashKey',
        tableName: 'test-table',
      })
    ).rejects.toThrow(ExistingTableError);
  });

  test('throws missing table error when describing a table that does not exist', async () => {
    const engine = getEngine();
    await expect(
      engine.describeTable({
        tableName: 'test-table',
      })
    ).rejects.toThrow(MissingTableError);
  });

  test('throws missing table error when adding to a table that does not exist', async () => {
    const engine = getEngine();
    await expect(
      engine.addItem({
        item: { hashKey: 'test-hash-key' },
        tableName: 'test-table',
      })
    ).rejects.toThrow(MissingTableError);
  });

  test('throws missing table error when getting from table that does not exist', async () => {
    const engine = getEngine();
    await expect(
      engine.getItems({
        hashKeyName: 'hashKey',
        hashKeyValue: 'test-hash-key',
        tableName: 'test-table',
      })
    ).rejects.toThrow(MissingTableError);
  });

  test('throws missing key error when adding an item that is missing an expected hash key', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName: 'test-table',
    });
    await expect(
      engine.addItem({
        item: { otherHashKey: 'test-hash-key' },
        tableName: 'test-table',
      })
    ).rejects.toThrow(MissingKeyError);
  });

  test('throws missing key error when adding an item that is missing an expected sort key', async () => {
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
      tableName: 'test-table',
    });
    await expect(
      engine.addItem({
        item: { hashKey: 'test-hash-key' },
        tableName: 'test-table',
      })
    ).rejects.toThrow(MissingKeyError);
  });
};

export default runEngineTests;
