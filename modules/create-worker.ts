import * as path from "path";
import { NamesObj, WorkerMessage } from "./types-inventory";
import { Worker } from 'worker_threads';
import { fileMapper as fm } from './file-mapper';
import * as fs from 'fs';
import * as _ from 'lodash';

// We need to pass a js file as a worker script, since webpack does not compile it 
const workerScript = path.resolve(__dirname, './worker-script.js');

export const createWorker = (namesObj: NamesObj): Worker => {

    // create worker
    let worker = new Worker(workerScript, { workerData: { namesObj } })

    // handle errors
    worker.on('error', err => console.error('error found on worker: ', err));
    worker.on('exit', code => {
        if (code != 0) console.error(`Worker stopped with exit code ${code}`)
    });

    // handler to deal with messages from worker
    worker.on('message', (data: WorkerMessage) => {
        if (!data.namesObj) return;

        for (let name in namesObj) {
            namesObj[name] += data.namesObj[name] ? data.namesObj[name] : 0;
        }

        // data.left === 0 indicates if the worker has submitted its work
        if (data.left === 0) {

            // sort the count in a desc order 
            var nameCountArr: [string, number][] = [];      // [['john', 3], ['jane', 7]...]
            for (var name in namesObj) {
                nameCountArr.push([name, namesObj[name]]);
            }
            nameCountArr.sort((a, b) => b[1] - a[1]);


            // remove the output file before appending
            fs.existsSync(fm.outputFile) && fs.unlinkSync(fm.outputFile); 
            
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