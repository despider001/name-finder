// ⚠️ We need to pass a js file as a worker script, since webpack does not compile it 


// As the worker is initiated, it is given an the starting state of namesObj
// Since main thread and worker thread cannot refer to the same obj, every worker will keep track of their count
// when done processing all data, they will inform the main thread
// main will do the aggregation

const { parentPort, workerData } = require('worker_threads');
const _ = require('lodash');

let namesObj = {}       //  NameObj >> modules/types-inventory
console.time('Time')
parentPort.on('message', (data) => {        // data: workerMessage >> modules/types-inventory

    // stop the worker if stream is finished
    if (data.msg && data.msg === 'stop') {
        if (data.left === 0) console.timeEnd('Time');
        parentPort.postMessage({ namesObj, left: data.left })
        return parentPort.close();
    }

    if (_.isEmpty(namesObj)) {
        namesObj = workerData.namesObj
    }

    // replace all punctuation with space
    data.chunk = data.chunk.replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~]/g, ' ');

    // extract an array of words
    let words = _.words(data.chunk) 

    for (let word of words) {
        word = word.toLowerCase();
        if (namesObj[word] === 0 || namesObj[word]) {
            namesObj[word] += 1;
        }
    }
})