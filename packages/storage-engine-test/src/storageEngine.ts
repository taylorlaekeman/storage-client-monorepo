/* eslint-disable @typescript-eslint/require-await */
import StorageEngine, {
  AddItemInput,
  CreateTableInput,
  ExistingTableError,
  DescribeTableInput,
  GetItemsInput,
  MissingKeyError,
  MissingTableError,
  Item,
} from '@taylorlaekeman/storage-engine-core';

type IStorageEngine = typeof StorageEngine;

class TestStorageEngine implements IStorageEngine {
  readonly tables: Tables;

  constructor({ tables = {} }: { tables?: Tables } = {}) {
    this.tables = tables;
  }

  addItem = async ({ item, tableName }: AddItemInput) => {
    if (!(tableName in this.tables)) throw new MissingTableError({ tableName });
    const {
      hashKey: hashKeyName,
      items = {},
      sortKey: sortKeyName,
    } = this.tables[tableName];
    const hashKeyValue = item[hashKeyName] as string;
    if (!hashKeyValue) throw new MissingKeyError();
    if (!items[hashKeyValue]) items[hashKeyValue] = {};
    getNewTableItems();
    const newItems = { ...items } as Items;
    if (!sortKeyName) {
      newItems[hashKeyValue] = item;
      this.tables[tableName].items = newItems;
      return item;
    }
    const sortKeyValue = item[sortKeyName] as string;
    if (!sortKeyValue) throw new MissingKeyError();
    newItems[hashKeyValue] = {
      ...items[hashKeyValue],
      [sortKeyValue]: item,
    } as Record<string, Item>;
    this.tables[tableName].items = newItems;
    return item;
  };

  createTable = async ({ hashKey, sortKey, tableName }: CreateTableInput) => {
    if (tableName in this.tables) throw new ExistingTableError({ tableName });
    this.tables[tableName] = { hashKey, items: {}, sortKey };
  };

  describeTable = async ({ tableName }: DescribeTableInput) => {
    if (!(tableName in this.tables)) throw new MissingTableError({ tableName });
    const { hashKey, sortKey } = this.tables[tableName];
    return { hashKey, sortKey };
  };

  getItems = async ({
    hashKeyValue,
    tableName,
  }: GetItemsInput): Promise<Item[]> => {
    if (!(tableName in this.tables)) throw new MissingTableError({ tableName });
    const { items, sortKey } = this.tables[tableName];
    if (!items) return [];
    if (!items[hashKeyValue]) return [];
    if (!sortKey) return [items[hashKeyValue] as Item];
    return Object.values(items[hashKeyValue] as Record<string, Item>);
  };
}

export type Tables = Record<
  string,
  {
    hashKey: string;
    items?: Items;
    sortKey?: string;
  }
>;

type Items = ItemsWithSortKey | ItemsWithoutSortKey;

type ItemsWithSortKey = Record<string, Record<string, Item>>;

type ItemsWithoutSortKey = Record<string, Item>;

const getNewTableItems = ({
  hashKeyName,
  items,
  item,
  sortKeyName,
}: {
  hashKeyName: string;
  items: Items;
  item: Item;
  sortKeyName?: string;
}): Items => {
  if (!sortKeyName)

  return { ...items };
};

export default TestStorageEngine;
