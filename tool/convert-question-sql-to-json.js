import fs from 'fs/promises';

const filename = 'create-one-strike-writing-question-square.sql';
const sql = await fs.readFile(`./out/${filename}`, 'utf8');
const lines = sql.split('\n').slice(1);
const questions = lines.map((x) => {
    const line = x.replace('(', '').replace(')', '');
    const elements = line.split(',').slice(0, 4);
    const cells = line.replace(/^.*?'(.*?)'.*?$/, '$1');

    return {
        width: Number(elements[0]),
        height: Number(elements[1]),
        block: Number(elements[2]),
        straight: Boolean(elements[3]),
        cells: JSON.parse(cells)
    };
});
const json = JSON.stringify(questions, null, 4);

await fs.writeFile(`./out/create-one-strike-writing-question-square.json`, json, 'utf8');
