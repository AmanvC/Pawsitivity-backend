import express from "express";
import apiRouter from "./api";

const RoutesRouter = express.Router();

RoutesRouter.use("/api", apiRouter);

export default RoutesRouter;