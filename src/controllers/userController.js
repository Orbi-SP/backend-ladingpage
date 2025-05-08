import userService from "../services/userService.js";

// Cadastrando um usuário
const createUser = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      // AQUI SERIA FEITO O PROCESSO DE HASH DE SENHA
      await userService.Create(name, email, password);
      res.sendStatus(201); // Cod. 201 (CREATED)
    } catch (error) {
      console.log(error);
      res.sendStatus(500); // Erro interno do servidor
    }
  };

// Autenticando um usuário (sem JWT)
const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email) {
        return res.status(400).json({ error: "O e-mail enviado é inválido." });
      }
      const user = await userService.getOne(email,);
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }
      if (user.password !== password) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }
      // Autenticado com sucesso (sem JWT)
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
      res.sendStatus(500); // Internal Server Error
    }
  };
  
export default { createUser, loginUser };
