import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const outDirectory = './out/';

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

export function appendFile(fileName, data) {
    if (!fs.existsSync(outDirectory)) {
        fs.mkdirSync(outDirectory);
    }

    fs.appendFileSync(outDirectory + fileName, data);
}

export function readFile(fileName) {
    if (!fs.existsSync(outDirectory + fileName)) {
        return undefined;
    }

    return fs.readFileSync(outDirectory + fileName);
}

export function writeFile(fileName, data) {
    if (!fs.existsSync(outDirectory)) {
        fs.mkdirSync(outDirectory);
    }

    fs.writeFileSync(outDirectory + fileName, data);
}
