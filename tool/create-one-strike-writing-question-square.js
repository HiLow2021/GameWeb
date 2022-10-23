import { OneStrokeWritingGenerator } from 'shared/game/oneStrokeWriting/oneStrokeWritingGenerator';
import { CommonUtility } from 'shared/utility/commonUtility';
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
                    const cells = CommonUtility.create2Array(ss, ss);
                    CommonUtility.copy2Array(generator.board.cells, cells);

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
    result ||= check(questionCells, CommonUtility.rotate90(target));
    result ||= check(questionCells, CommonUtility.rotate180(target));
    result ||= check(questionCells, CommonUtility.rotate270(target));
    result ||= check(questionCells, CommonUtility.transpose(target));
    result ||= check(questionCells, CommonUtility.rotate90(CommonUtility.transpose(target)));
    result ||= check(questionCells, CommonUtility.rotate180(CommonUtility.transpose(target)));
    result ||= check(questionCells, CommonUtility.rotate270(CommonUtility.transpose(target)));

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
