import express from "express";
import profileController from "../controllers/profileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const profileRoutes = express.Router();

// Autenticação
profileRoutes.post("/user", profileController.createProfile);
profileRoutes.post("/auth", profileController.loginProfile);

// Partidas e Ranking
profileRoutes.use("/runs", authMiddleware);
profileRoutes.post("/runs", profileController.createRun);
profileRoutes.get("/runs/ranking", profileController.getGlobalRanking);
profileRoutes.get("/runs/user/:userId", profileController.getUserRuns);

export default profileRoutes;