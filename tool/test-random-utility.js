import { RandomUtility } from 'shared/utility/randomUtility';
import { getFileNameWithoutExtension, writeFile } from './shared.js';

const min = 0;
const max = 2
const count = 100;
const result = [...Array(count)].map(() => RandomUtility.random(min, max))

writeFile(getFileNameWithoutExtension(import.meta.url) + '.json', JSON.stringify(result, null, 4));
