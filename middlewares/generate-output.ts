import { Handler, NextFunction, Request, Response } from "express";
import countNames from "../modules/count-names";

export const generateOutput: Handler = (req: Request, res: Response, next: NextFunction) => {
    countNames(); // let the function run async
    res.status(200).json({ status: 'Generating output file. To check status, go to /status' });
}