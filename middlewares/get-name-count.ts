import { fileMapper as fm } from './../modules/file-mapper';
import { Handler, NextFunction, Request, Response } from "express";
import * as fs from 'fs';
import { readNames } from "../modules/read-names";
import { Status } from '../modules/types-inventory';


export const getNameCount: Handler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        // check if output is not found
        if (!fs.existsSync(fm.outputFile)) {

            // status file is not found
            if (!fs.existsSync(fm.statusFile)) {
                return res.status(404).json({ error: 'Ouput file not found! Make sure to generate the file first > /generate-output' });
            }

            const status = <Status>fs.readFileSync(fm.statusFile).toString('utf-8');

            // if status is shown as done, yet output is not there, prompt to generate the file
            if (status === "done") {
                return res.status(404).json({ error: 'Ouput file not found! Make sure to generate the file first > /generate-output' });
            }

            // if on progress, prompt to try later
            return res.status(202).json({ message: 'Output file is currently being generated, please try again later' });


        }

        let name = req.params.name;
        let nameCount = await readNames(name, fm.outputFile);
        return res.status(200).json(nameCount);

    } catch (error) {
        console.error('error found in getNameCount: ', error);
        return res.status(500).json({ error: 'Something went wrong' });
    }

}


