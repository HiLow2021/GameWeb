import { CommonUtility } from 'shared/utility/commonUtility';
import { getFileNameWithoutExtension, writeFile } from './shared.js';

const width = 4;
const height = 2;

const normal = CommonUtility.create2Array(width, height);
normal[0][3] = true;

const rotate90 = CommonUtility.rotate90(normal);
const rotate180 = CommonUtility.rotate180(normal);
const rotate270 = CommonUtility.rotate270(normal);
const transpose = CommonUtility.transpose(normal);

const result = { normal, rotate90, rotate180, rotate270, transpose };

writeFile(getFileNameWithoutExtension(import.meta.url) + '.json', JSON.stringify(result, null, 4));
