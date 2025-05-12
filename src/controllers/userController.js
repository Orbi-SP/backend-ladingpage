// userController.js
import bcrypt from "bcrypt";
import userService from "../services/userServices.js";

const SALT_ROUNDS = 10;

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await userService.Create(name, email, hashedPassword);
    res.sendStatus(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
    }

    const user = await userService.login(email, password);

    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    return res.status(200).json({
      message: "Login realizado com sucesso.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

export default { createUser, loginUser };
