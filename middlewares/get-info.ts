import { Handler, NextFunction, Request, Response } from "express";
export const getInfo: Handler = (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
        "available-routes": {
            "/name-count/:name": "returns count of the name",
            "/generate-output": "reads the ebook and outputs the name count in output.txt",
            "/status": "returns the status of the process"
        }
    })
}