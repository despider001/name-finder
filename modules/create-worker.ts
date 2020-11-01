import * as path from "path";
import { BrokenWordTracker, NamesObj, WorkerMessage } from "./types-inventory";
import { Worker } from 'worker_threads';
import { fileMapper as fm } from './file-mapper';
import * as fs from 'fs';
import * as _ from 'lodash';

// We need to pass a js file as a worker script, since webpack does not compile it 
const workerScript = path.resolve(__dirname, './worker-script.js');

export const createWorker = (namesObj: NamesObj, brokenWordsArr: BrokenWordTracker[]): Worker => {

    let worker = new Worker(workerScript, { workerData: { namesObj } })

    worker.on('error', err => console.error('error found on worker: ', err));
    worker.on('exit', code => {
        if (code != 0) console.error(`Worker stopped with exit code ${code}`)
    });

    // handler to deal with messages from worker
    worker.on('message', (data: WorkerMessage) => {

        // update the brokenWordsArr
        if (data.brokenWords) {
            brokenWordsArr[data.brokenWords[0]] = data.brokenWords;
        }

        if (!data.namesObj) return;

        for (let name in namesObj) {
            namesObj[name] += data.namesObj[name] ? data.namesObj[name] : 0;
        }

        // here (data.left === 0) indicates if all the workers are with their tasks work
        if (data.left === 0) {

            /**
             * Here is an example of brokenWordsArr
            [
              [ 0, 'The', 'brough' ],
              [ 1, 't', 'so\r' ],
              [ 2, '\nprevalent,', 'got' ],
              [ 3, '', 'h' ]
            ]
            notice that, the 2nd elem of 1st array and 1st elem of 2nd array together makes a word 'brought'
             */
            for (let i = 0; i < brokenWordsArr.length; i++) {

                if (i === 0) continue;

                // if either of the element are empty, it is already considered. So skip (3rd and 4th elem in example)
                if (_.isEmpty(brokenWordsArr[i][0]) || _.isEmpty(brokenWordsArr[i - 1][1])) continue;

                let possibleWord = `${brokenWordsArr[i][0] + brokenWordsArr[i - 1][1]}`;
                if (namesObj[possibleWord] === 0 || namesObj[possibleWord]) {
                    namesObj[possibleWord] += 1;
                }
            }
            // sort the count in a desc order 
            var nameCountArr: [string, number][] = [];      // [['john', 3], ['jane', 7]...]
            for (var name in namesObj) {
                nameCountArr.push([name, namesObj[name]]);
            }
            nameCountArr.sort((a, b) => b[1] - a[1]);

            // loop though the array and append them to output (synchronously, not to mix order)
            for (let item of nameCountArr) {
                fs.appendFileSync(fm.outputFile, `${_.capitalize(item[0])}: ${item[1]}\r\n`);
            }

            // update the status
            fs.writeFile(fm.statusFile, 'done', err => {
                if (err) console.error('error updating status', err);
            });
            console.log('✔ Success! Output file generated!');
            return namesObj;
        }
    });
    return worker;
}