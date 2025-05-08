import User from "../models/User.js";

class userService {
  // Método para cadastrar um usuário
  async Create(name, email, password) {
    try {
      const newUser = new User({
        name,
        email,
        password,
      });
      await newUser.save();
    } catch (error) {
      console.log(error);
    }
  }
  async login(email,password) {
    try {
      const user = await User.findOne({ email: email, password: password});
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new userService();
