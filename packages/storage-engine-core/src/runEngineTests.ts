import type StorageEngine from './storageEngine';

const runEngineTests = ({
  getEngine,
  getTableName = () => 'test-table',
}: {
  getEngine: () => StorageEngine;
  getTableName?: () => string;
}) => {
  test('creates and describes table with sort key', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
      tableName,
    });
    const result = await engine.describeTable({ tableName });
    expect(result).toMatchObject({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
    });
  });

  test('creates and describes table without sort key', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName,
    });
    const result = await engine.describeTable({ tableName });
    expect(result).toMatchObject({
      hashKey: 'hashKey',
    });
  });

  test('adds items to and gets items from table with sort key', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
      tableName,
    });
    const sharedProperties = {
      booleanProperty: true,
      hashKey: 'test-hash-key',
      numericProperty: 9,
      stringProperty: 'test-value',
    };
    const firstReturnedItem = await engine.addItem({
      item: { ...sharedProperties, sortKey: 'test-sort-key-1' },
      tableName,
    });
    const secondReturnedItem = await engine.addItem({
      item: { ...sharedProperties, sortKey: 'test-sort-key-2' },
      tableName,
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName,
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
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName,
    });
    const item = {
      booleanProperty: true,
      hashKey: 'test-hash-key',
      numericProperty: 9,
      stringProperty: 'test-value',
    };
    const returnedItem = await engine.addItem({
      item,
      tableName,
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName,
    });
    expect(returnedItem).toMatchObject(item);
    expect(retrievedItems).toMatchObject([item]);
  });

  test('overwrites item with matching simple (hash) key', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName,
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
      tableName,
    });
    await engine.addItem({
      item: secondItem,
      tableName,
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName,
    });
    expect(retrievedItems).toMatchObject([secondItem]);
  });

  test('overwrites item with matching composite (hash and sort) key', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
      tableName,
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
      tableName,
    });
    await engine.addItem({
      item: secondItem,
      tableName,
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName,
    });
    expect(retrievedItems).toMatchObject([secondItem]);
  });

  test('gets empty list when no items match key', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName,
    });
    const retrievedItems = await engine.getItems({
      hashKeyName: 'hashKey',
      hashKeyValue: 'test-hash-key',
      tableName,
    });
    expect(retrievedItems).toMatchObject([]);
  });

  test('throws existing table error when creating a table that already exists', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName,
    });
    await expect(
      engine.createTable({
        hashKey: 'hashKey',
        tableName,
      })
    ).rejects.toThrow(/A table with the name 'test-table' already exists./);
  });

  test('throws missing table error when describing a table that does not exist', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await expect(
      engine.describeTable({
        tableName,
      })
    ).rejects.toThrow(/A table with the name 'test-table' could not be found./);
  });

  test('throws missing table error when adding to a table that does not exist', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await expect(
      engine.addItem({
        item: { hashKey: 'test-hash-key' },
        tableName,
      })
    ).rejects.toThrow(/A table with the name 'test-table' could not be found./);
  });

  test('throws missing table error when getting from table that does not exist', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await expect(
      engine.getItems({
        hashKeyName: 'hashKey',
        hashKeyValue: 'test-hash-key',
        tableName,
      })
    ).rejects.toThrow(/A table with the name 'test-table' could not be found./);
  });

  test('throws missing key error when adding an item that is missing an expected hash key', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      tableName,
    });
    await expect(
      engine.addItem({
        item: { otherHashKey: 'test-hash-key' },
        tableName,
      })
    ).rejects.toThrow(/The item is missing a key attribute./);
  });

  test('throws missing key error when adding an item that is missing an expected sort key', async () => {
    const tableName = getTableName();
    const engine = getEngine();
    await engine.createTable({
      hashKey: 'hashKey',
      sortKey: 'sortKey',
      tableName,
    });
    await expect(
      engine.addItem({
        item: { hashKey: 'test-hash-key' },
        tableName,
      })
    ).rejects.toThrow(/The item is missing a key attribute./);
  });
};

export default runEngineTests;
