import { runEngineTests } from '@taylorlaekeman/storage-engine-core';

import StorageEngine from '@src/storageEngine';

const getEngine = () => new StorageEngine();

runEngineTests({ getEngine });
