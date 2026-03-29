const bcrypt = require("bcryptjs");
const User = require("../models/User");
const jwt = require("jsonwebtoken")
const registerUser = async (req, res) => {
  try {
    const data = req.body;
    const oldUser = await User.findOne({ email: data.email });

    if (oldUser) {
      res.status(400).json({ message: "This email is already taken" });
    } else {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(data.password, salt);
      data.password = hash;
      const user = User(data);
      await user.save();
      res.status(201).json({ name: user.name, email: user.email, id: user.id });
    }
  } catch (error) {
    console.error(`Error registering users `, error.message);
    res.status(500).json({ message: "Unabble to register user" });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        const token = jwt.sign({ name: user.name, email: user.email, id: user.id }, process.env.JWT_SECRET, {expiresIn: "1d"})
        res
          .status(200)
          .json({ name: user.name, email: user.email, id: user.id, token: token});
      } else {
        console.error("Invalid password");
        res.status(400).json({ message: "invalid password" });
      }
    } else {
      console.error("user not found");
      res.status(400).json({message: "user not found"})
    }
  } catch (error) {
    console.error("error loging in", error.message);
    res.status(400).json({ message: "user not found" });
  }
};

module.exports = {registerUser, loginUser}
