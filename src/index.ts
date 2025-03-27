import express, { Express } from "express";
import dotenv from "dotenv";
import RoutesRouter from "./routes";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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