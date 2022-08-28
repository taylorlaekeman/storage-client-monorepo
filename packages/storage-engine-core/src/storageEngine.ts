interface StorageEngine {
  addItem: (input: AddItemInput) => Promise<Item>;

  createTable: (input: CreateTableInput) => Promise<void>;

  describeTable: (input: DescribeTableInput) => Promise<TableDescription>;

  getItems: (input: GetItemsInput) => Promise<Item[]>;
}

export interface AddItemInput {
  item: Item;
  tableName: string;
}

export type Item = Record<string, boolean | number | string>;

export interface CreateTableInput {
  hashKey: string;
  sortKey?: string;
  tableName: string;
}

export interface DescribeTableInput {
  tableName: string;
}

export interface TableDescription {
  hashKey: string;
  sortKey?: string;
}

export interface GetItemsInput {
  hashKeyName: string;
  hashKeyValue: string;
  tableName: string;
}

export default StorageEngine;
