import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function getFullFileName(url) {
    return fileURLToPath(url);
}

export function getFileName(url) {
    return path.basename(getFullFileName(url));
}

export function getFileNameWithoutExtension(url) {
    return path.basename(getFullFileName(url)).replace(/\..*?$/, '');
}

export function getDirectoryName(url) {
    return path.dirname(getFullFileName(url));
}

export function writeFile(fileName, data) {
    const outDirectory = './out/';
    if (!fs.existsSync(outDirectory)) {
        fs.mkdirSync(outDirectory);
    }

    fs.writeFileSync(outDirectory + fileName, data);
}
