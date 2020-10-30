import { fileMapper as fm } from './../modules/file-mapper';
import { Handler, NextFunction, Request, Response } from "express";
import { readNames } from "../modules/read-names";


export const getNameCount: Handler = async (req: Request, res: Response, next: NextFunction) => {
    let name = req.params.name;
    let nameCount = await readNames(name, fm.outputFile);
    res.json(nameCount);
}


