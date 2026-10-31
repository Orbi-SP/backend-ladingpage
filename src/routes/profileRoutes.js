import express from "express";
import profileController from "../controllers/profileController.js";

const profileRoutes = express.Router();

// Autenticação
profileRoutes.post("/user", profileController.createProfile);
profileRoutes.post("/auth", profileController.loginProfile);

// Partidas e Ranking
profileRoutes.post("/runs", profileController.createRun); // Salva run e seus scores
profileRoutes.get("/runs/ranking", profileController.getGlobalRanking); // Ranking total com regras de desempate
profileRoutes.get("/runs/user/:userId", profileController.getUserRuns); // Histórico pessoal

export default profileRoutes;