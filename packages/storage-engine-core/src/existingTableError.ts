import StorageError from './storageError';

class ExistingTableError extends StorageError {
  constructor({ tableName }: { tableName: string }) {
    super(`A table with the name '${tableName}' already exists.`);
  }
}

export default ExistingTableError;
