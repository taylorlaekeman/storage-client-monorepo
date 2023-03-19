import { StorageError } from '@taylorlaekeman/storage-engine-core';

class MissingLocationError extends StorageError {
  constructor({ location }: { location: string }) {
    super(`Directory '${location}' could not be found.`);
  }
}

export default MissingLocationError;
