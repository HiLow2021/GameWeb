import { OneStrokeWritingGenerator } from 'shared/game/oneStrokeWriting/oneStrokeWritingGenerator';
import { CommonUtility } from 'shared/utility/commonUtility';
import { getFileNameWithoutExtension, writeFile } from './shared.js';

const width = { min: 4, max: 4 };
const height = { min: 4, max: 4 };
const block = { min: 1, max: 1 };
const straight = [true];
const count = 10;
const tryCount = 100;
const questions = [];

for (const s of straight) {
    for (let x = width.min; x <= width.max; x++) {
        for (let y = height.min; y <= height.max; y++) {
            const generator = new OneStrokeWritingGenerator(x, y, s);

            for (let b = block.min; b <= block.max; b++) {
                for (let i = 0; i < count; i++) {
                    const result = generator.generate(b, tryCount);
                    if (result) {
                        const cells = CommonUtility.create2Array(x, y);
                        CommonUtility.copy2Array(generator.board.cells, cells);
                        questions.push({ width: x, height: y, block: b, straight: s, cells });
                    }
                }
            }
        }
    }
}

writeFile(getFileNameWithoutExtension(import.meta.url) + '.json', JSON.stringify(questions, null, 4));
