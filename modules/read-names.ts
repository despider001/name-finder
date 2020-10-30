import * as fs from 'fs';
import * as readline from 'readline';
import { nameCount } from './types-inventory';

const readNames = (name: string, filePath): Promise<nameCount> => new Promise((resolve, reject) => {

    // read the file line by line and update the map
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath)
    });

    // as line received, check if the name match
    rl.on('line', function (data: string) {
        let words = data.split(': ');
        if (words[0] && words[0].toLowerCase() === name.toLowerCase()) {
            resolve({ name: words[0], count: +words[1] })
        }

    });

    // if data finishes without resolving, resolve with count 0
    rl.on('close', function () {
        resolve({ name, count: 0 });
    });
});

export { readNames }