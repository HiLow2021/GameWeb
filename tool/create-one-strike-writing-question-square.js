import { OneStrokeWritingGenerator } from 'shared/game/oneStrokeWriting/oneStrokeWritingGenerator';
import { ArrayUtility } from 'shared/utility/arrayUtility';
import { getFileNameWithoutExtension, readFile, appendFile, writeFile } from './shared.js';

const baseFileName = getFileNameWithoutExtension(import.meta.url);
let total = 0;

const size = { min: 4, max: 10 };
const straight = [true];
const count = 20;
const tryCount = 1000;

saveQuestionSql('insert into table_name(width,height,block,straight,cells) values \n');

for (const s of straight) {
    for (let ss = size.min; ss <= size.max; ss++) {
        const generator = new OneStrokeWritingGenerator(ss, ss, s);

        for (let b = Math.floor(ss / 2); b <= ss; b++) {
            const questions = [];

            for (let i = 0; i < count; i++) {
                const result = generator.generate(b, tryCount);
                if (result) {
                    const cells = ArrayUtility.create2Array(ss, ss);
                    ArrayUtility.copy2Array(generator.board.cells, cells);

                    if (!checkDuplication(questions, cells)) {
                        const question = { width: ss, height: ss, block: b, straight: s, cells };
                        questions.push(question);

                        saveQuestionJson(question);
                        saveQuestionSql(`(${ss},${ss},${b},${Number(s)},'${JSON.stringify(cells)}'),\n`);
                    }
                }
            }

            total += questions.length;
            console.log(`generated: ${questions.length}, width: ${ss}, height: ${ss}, block: ${b}, straight: ${s}`);
        }
    }
}

fixSqlSuffix();
console.log(`total generated: ${total}`);

function checkDuplication(questions, target) {
    let result = false;
    const questionCells = questions.map((x) => JSON.stringify(x.cells.flat()));

    result ||= check(questionCells, target);
    result ||= check(questionCells, ArrayUtility.rotate90(target));
    result ||= check(questionCells, ArrayUtility.rotate180(target));
    result ||= check(questionCells, ArrayUtility.rotate270(target));
    result ||= check(questionCells, ArrayUtility.transpose(target));
    result ||= check(questionCells, ArrayUtility.rotate90(ArrayUtility.transpose(target)));
    result ||= check(questionCells, ArrayUtility.rotate180(ArrayUtility.transpose(target)));
    result ||= check(questionCells, ArrayUtility.rotate270(ArrayUtility.transpose(target)));

    return result;

    function check(questions, target) {
        questions.push(JSON.stringify(target.flat()));
        const result = new Set(questionCells).size !== questionCells.length;
        questions.pop();

        return result;
    }
}

function saveQuestionJson(question) {
    const jsonString = readFile(baseFileName + '.json');
    const json = jsonString ? JSON.parse(jsonString) : [];
    json.push(question);

    writeFile(baseFileName + '.json', JSON.stringify(json, null, 4));
}

function saveQuestionSql(text) {
    appendFile(baseFileName + '.sql', text);
}

function fixSqlSuffix() {
    const sql = readFile(baseFileName + '.sql');
    const sqlString = sql ? sql.toString('utf8', 0, sql.length) : '';

    writeFile(baseFileName + '.sql', sqlString.replace(/,\s*?$/, ';'));
}
