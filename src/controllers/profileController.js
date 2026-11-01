import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import profileServices from "../services/profileServices.js";

const SALT_ROUNDS = 10;

const createProfile = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Campos obrigatórios ausentes." });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await profileServices.create(username, email, hashedPassword);
    return res.sendStatus(201);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao criar perfil." });
  }
};

const loginProfile = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    const profile = await profileServices.login(email, password);

    if (!profile) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET não está configurado.");
      return res.status(500).json({ error: "Autenticação não configurada." });
    }

    const token = jwt.sign(
      { sub: profile.id, email: profile.email },
      secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      token,
      profile: {
        id: profile.id, // Supabase usa 'id', não '_id'
        username: profile.username, // Correção de profile.name para profile.username
        email: profile.email,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro no login." });
  }
};

// --- NOVOS ENDPOINTS ---

const createRun = async (req, res) => {
  try {
    const { runData, scoresData } = req.body;
    /*
      Exemplo de payload esperado:
      {
        "runData": {
          "user_id": "uuid-do-usuario",
          "started_at": "2023-10-10T10:00:00Z",
          "finished_at": "2023-10-10T10:05:00Z",
          "status": "finished",
          "total_points": 500,
          "total_errors": 2,
          "app_version": "1.0.0"
        },
        "scoresData": [
          { "points": 200, "stage": "Stage 1" },
          { "points": 300, "stage": "Stage 2" }
        ]
      }
    */
    if (!runData) {
      return res.status(400).json({ error: "Dados da run ausentes ou inválidos." });
    }

    const authenticatedRunData = {
      ...runData,
      user_id: req.user.sub,
    };
    const run = await profileServices.createRun(authenticatedRunData, scoresData);
    return res.status(201).json(run);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao registrar a Run." });
  }
};

const getGlobalRanking = async (req, res) => {
  try {
    const ranking = await profileServices.getGlobalRanking();
    return res.status(200).json(ranking);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar ranking." });
  }
};

const getUserRuns = async (req, res) => {
  try {
    const { userId } = req.params;
    if (userId !== req.user.sub) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const runs = await profileServices.getUserRuns(userId);
    return res.status(200).json(runs);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro ao buscar histórico do usuário." });
  }
};

export default {
  createProfile,
  loginProfile,
  createRun,
  getGlobalRanking,
  getUserRuns
};