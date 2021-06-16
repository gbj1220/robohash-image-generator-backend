const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

module.exports = {
  signUp: async (req, res) => {
    try {
      let salted = await bcrypt.genSalt(12);

      let hashedPassword = await bcrypt.hash(req.body.password, salted);

      const { email, firstName, lastName, mobileNumber } = req.body;

      let createdUser = new User({
        firstName,
        lastName,
        mobileNumber,
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
      res.status(500).json({ Message: error.message });
    }
  },

  login: async (req, res) => {
    try {
      let foundUser = await User.findOne({ email: req.body.email });
      if (!foundUser) {
        throw "User does not exist!";
      }

      let comparePassword = await bcrypt.compare(
        req.body.password,
        foundUser.password
      );

      if (!comparePassword) {
        throw "That is not the correct password. Please try again.";
      }

      let jwtToken = jwt.sign(
        {
          username: foundUser.username,
          email: foundUser.email,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.json({
        message: "Logged In",
        jwtToken,
      });
    } catch (error) {
      res.status(500).json({ Message: error.message });
    }
  },

  checkUserIsLoggedIn: (req, res) => {
    try {
      console.log("fuck");
    } catch (error) {
      console.log(error);
    }
  },
};
