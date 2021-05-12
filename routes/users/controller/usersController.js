const bcrypt = require("bcryptjs");
const User = require("../model/User");
const jwt = require("jsonwebtoken");
module.exports = {
  signUp: async (req, res) => {
    try {
      let salted = await bcrypt.genSalt(12);

      let hashedPassword = await bcrypt.hash(req.body.password, salted);

      const { firstName, lastName, phoneNumber, email } = req.body;

      let createdUser = new User({
        firstName,
        lastName,
        phoneNumber,
        email,
        password: hashedPassword,
      });

      let savedCreatedUser = await createdUser.save();

      res.json({
        message: "User Created",
        user: savedCreatedUser,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      let foundUser = await User.findOne({ email: req.body.email });

      if (!foundUser) {
        throw { message: "User not found." };
      }

      let comparedPassword = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (!comparedPassword) {
        throw "Incorrect password";
      }

      const jwtToken = jwt.sign(
        {
          email: foundUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "12h",
        }
      );

      res.json({
        message: "User Created",
        jwtToken,
      });
    } catch (e) {
      res.status(500).json({ Message: e });
    }
  },
};
