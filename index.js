import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente do .env
dotenv.config();

const app = express();

// Importando as rotas de Usuários
import profileRoutes from "./src/routes/profileRoutes.js";

// Configurações do Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurando o CORS
app.use(cors());

app.use("/", profileRoutes);

// Iniciando o servidor
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});