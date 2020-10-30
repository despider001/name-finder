import { getNameCount } from '../middlewares/get-name-count';
import { getStatus } from '../middlewares/get-status';
import countNames from '../modules/count-names';
import * as express from 'express';
const router = express.Router();

// get info
router.get('/', (req: express.Request, res: express.Response) => {
    res.json({
        "available-routes": {
            "/name-count/:name": "returns count of the name",
            "/generate-output": "reads the ebook and outputs the name count in output.txt",
            "/status": "returns the status of the process"
        }
    })
})

// get name count
router.get('/name-count/:name', getNameCount);

// generate "name count" file > output.txt
router.get('/generate-output', (req: express.Request, res: express.Response) => {
    countNames();
    res.json({ status: 'Generating file. To check status, go to /status' });
});

// get status of the process
router.get('/status', getStatus);

export default router;