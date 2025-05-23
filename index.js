import express from "express";
import mongoose from "mongoose";
import cors from "cors"
const app = express();

// Importando as rotas (endpoints) de Usuários
import userRoutes from "./src/routes/userRoutes.js"

// Configurações do Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurando o CORS
app.use(cors()) // Aberto

app.use('/', userRoutes)

// Iniciando a conexão com o banco de dados do MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/savit")

// Iniciando o servidor
const port = 4000;
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`API rodando em http://localhost:${port}.`);
  }
});
