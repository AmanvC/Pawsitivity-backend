import express, { Request, Response } from "express";

const v1Router = express.Router();

v1Router.get("/", (req: Request, res: Response) => { res.send('Path: /api/v1') });

export default v1Router;