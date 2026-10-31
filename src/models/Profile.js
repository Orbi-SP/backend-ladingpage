import mongoose from "mongoose";

// Documento aninhado
const profilesSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

// Aqui está sendo criado a coleção games no banco de dados
const Profile = mongoose.model("Profile", profilesSchema);

export default Profile;
