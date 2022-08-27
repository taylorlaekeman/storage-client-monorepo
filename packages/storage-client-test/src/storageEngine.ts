import IStorageEngine, {
  AddItemInput,
  CreateTableInput,
  ExistingTableError,
  GetItemsInput,
  MissingKeyError,
  MissingTableError,
  Item,
} from '@taylorlaekeman/storage-client-core';

class TestStorageEngine implements IStorageEngine {
  readonly tables: Tables;

  constructor({ tables = {} }: { tables?: Tables } = {}) {
    this.tables = tables;
  }

  addItem = async ({ item, tableName }: AddItemInput) => {
    if (!(tableName in this.tables)) throw new MissingTableError({ tableName });
    const {
      hashKey: hashKeyName,
      items,
      sortKey: sortKeyName,
    } = this.tables[tableName];
    const hashKeyValue = item[hashKeyName];
    if (!hashKeyValue) throw new MissingKeyError();
    if (!items[hashKeyValue]) items[hashKeyValue] = {};
    if (!sortKeyName) {
      this.tables[tableName].items[hashKeyValue] = item;
      return item;
    }
    const sortKeyValue = item[sortKeyName];
    if (!sortKeyValue) throw new MissingKeyError();
    if (!items[hashKeyValue][sortKeyValue])
      items[hashKeyValue][sortKeyValue] = {};
    this.tables[tableName].items[hashKeyValue][sortKeyValue] = item;
    return item;
  };

  createTable = async ({ hashKey, sortKey, tableName }: CreateTableInput) => {
    if (tableName in this.tables) throw new ExistingTableError({ tableName });
    this.tables[tableName] = { hashKey, items: {}, sortKey };
  };

  describeTable = async ({ tableName }) => {
    if (!(tableName in this.tables)) throw new MissingTableError({ tableName });
    const { hashKey, sortKey } = this.tables[tableName];
    return { hashKey, sortKey };
  };

  getItems = async ({
    hashKeyName,
    hashKeyValue,
    tableName,
  }: GetItemsInput): Promise<Item[]> => {
    if (!(tableName in this.tables)) throw new MissingTableError({ tableName });
    const { items, sortKey } = this.tables[tableName];
    if (!items) return [];
    if (!items[hashKeyValue]) return [];
    if (!sortKey) return [items[hashKeyValue]];
    return Object.values(items[hashKeyValue]);
  };
}

export type Tables = Record<
  string,
  {
    hashKey: string;
    items: Items;
    sortKey?: string;
  }
>;

type Items = ItemsWithSortKey | ItemsWithoutSortKey;

type ItemsWithSortKey = Record<string, Record<string, Item>>;

type ItemsWithoutSortKey = Record<string, Item>;

export default TestStorageEngine;
