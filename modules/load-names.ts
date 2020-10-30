import * as fs from 'fs';
import * as readline from 'readline';
import { NamesObj } from './types-inventory';

/**
 * @description Takes firstname txt file and loads the names to app memory
 */
export const loadNames = (filePath: string): Promise<NamesObj> => new Promise((resolve, reject) => {
    let namesObj: NamesObj = {}

    // create read stream that streams line
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath)
    });

    // save the name to memory
    rl.on('line', function (data) {
        data = data.replace(/\s/g, '').toLowerCase();
        namesObj[data] = 0;

    });

    // resolve on done
    rl.on('close', function () {
        resolve(namesObj);
    });
});