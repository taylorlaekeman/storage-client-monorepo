import { runEngineTests } from '@taylorlaekeman/storage-client-core';

import StorageEngine from '@src/storageEngine';

const getEngine = () => new StorageEngine();

runEngineTests({ getEngine });
