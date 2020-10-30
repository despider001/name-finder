import { fileMapper as fm } from './../modules/file-mapper';
import * as fs from 'fs';
import { Request, Response, Handler } from 'express';

export const getStatus: Handler = (req: Request, res: Response) => {

    // handle status file not found
    if (!fs.existsSync(fm.statusFile)) {
        return res.json({ status: 'not found' });
    }

    // return status
    fs.readFile(fm.statusFile, (err, data) => {
        if (err) {
            console.error('Error in reading status: ', err);
            return res.json({ status: 'error' });
        }
        return res.json({ status: data.toString('utf-8') });
    });
}