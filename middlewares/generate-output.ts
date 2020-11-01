import { Handler, NextFunction, Request, Response } from "express";
import countNames from "../modules/count-names";

export const generateOutput: Handler = (req: Request, res: Response, next: NextFunction) => {
    countNames(); // let the function run async
    return res.redirect('/status');
}