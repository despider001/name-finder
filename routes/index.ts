import { getNameCount } from '../middlewares/get-name-count';
import { getStatus } from '../middlewares/get-status';
import countNames from '../modules/count-names';
import * as express from 'express';
import { getInfo } from '../middlewares/get-info';
import { generateOutput } from '../middlewares/generate-output';
const router = express.Router();


router.get('/', getInfo);

router.get('/name-count/:name', getNameCount);

router.get('/generate-output', generateOutput);

router.get('/status', getStatus);


export default router;