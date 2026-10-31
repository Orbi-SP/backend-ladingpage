import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileRoutes from "./src/routes/profileRoutes.js";

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.use("/", profileRoutes);

export default app;
