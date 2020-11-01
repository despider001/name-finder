import { fileMapper as fm } from './file-mapper';
import { Worker } from 'worker_threads';
import { loadNames } from './load-names';
import * as _ from 'lodash';
import * as fs from 'fs';
import { BrokenWordTracker, Status } from './types-inventory';
import { createWorker } from './create-worker';
import * as os from 'os';
import { resetFiles } from './reset-files';

const threadCount = os.cpus().length * 3;     // number of threads, could be dynamically generated based on number of core
const workersArr: Worker[] = []
let currentThread = 0;                        // to keep track of the worker that should receive the task
let brokenWordsArr: BrokenWordTracker[] = [];

/**
 * @description An async function that initiate the scanning of ebook
 * @returns false if something goes wrong
 */

const countNames = async (): Promise<boolean | null> => {

    if (!fs.existsSync(fm.namesFile) || !fs.existsSync(fm.ebookFile)) {
        console.log('namesFile || ebookFile missing!');
        return false;
    }

    if (fs.existsSync(fm.statusFile) && <Status>fs.readFileSync(fm.statusFile, 'utf-8') === 'on progress') {
        console.log('process on going!');
        return false;
    }

    resetFiles();
    console.log('Started...');

    // update the status before start reading
    fs.writeFileSync(fm.statusFile, <Status>'on progress');
    const namesObj = await loadNames(fm.namesFile);

    for (let i = 0; i < threadCount; i++) {
        workersArr.push(createWorker(namesObj, brokenWordsArr));
    }

    let stream = fs.createReadStream(fm.ebookFile, { encoding: 'utf-8' });

    let chunkCounter = 0;
    stream.on('data', (chunk) => {
        if (workersArr[currentThread]) {
            workersArr[currentThread].postMessage({ chunk, chunkCounter });
            currentThread = currentThread === workersArr.length - 1 ? 0 : currentThread + 1; // switch worker
            chunkCounter++;
        }
    })

    // as stream is closed, send message to worker so that they could be terminated
    // send stop message and the number workers left, so that main thread knows when to aggregate the data
    stream.on('close', () => {
        for (let i = 0; i < workersArr.length; i++) {
            workersArr[i].postMessage({ msg: 'stop', left: (workersArr.length - 1 - i) });
        }
    });
};





export default countNames;