import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    console.error("JWT_SECRET não está configurado.");
    return res.status(500).json({ error: "Autenticação não configurada." });
  }

  const authorization = req.headers.authorization;
  const [scheme, token] = authorization?.split(" ") || [];

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token de autenticação ausente." });
  }

  try {
    req.user = jwt.verify(token, secret);
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
};

export default authMiddleware;
