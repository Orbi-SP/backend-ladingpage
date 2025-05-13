// userServices.js
import User from "../models/User.js";
import bcrypt from "bcrypt";

class userService {
  async Create(name, email, password,phone) {
    const newUser = new User({ name, email, password,phone });
    await newUser.save();
  }

  async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    return user;
  }
}

export default new userService();
