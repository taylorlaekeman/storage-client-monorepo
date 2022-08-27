import StorageError from '@src/storageError';

class ExistingTableError extends StorageError {
  constructor({ tableName }: { tableName: string }) {
    super(
      `A table with the name '${tableName}' could not be created because a table with the same name already exists.`
    );
  }
}

export default ExistingTableError;
