import mongoose from "mongoose";

// Documento aninhado
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Aqui está sendo criado a coleção games no banco de dados
const User = mongoose.model("User", userSchema);

export default User;
