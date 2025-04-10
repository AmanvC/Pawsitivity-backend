import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import RoutesRouter from "./routes";
import mongoose from "mongoose";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
// ********* Global Error Handler *********
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use("/", RoutesRouter);

// ********* MongoDB Connection *********
import "./models"; // It will push all the schemas to Atlas
const MONGODB_URI: string = process.env.MONGODB_URI || "";
const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database connection successful.");
  } catch (err) {
    console.error("Error in connecting to database!!!", err);
    process.exit(1);
  }
};
connectDB();
// ********* MongoDB Connection Completed *********

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
