const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please Login or Signup");
    }

    const decodeObject = await jwt.verify(token, "vishalguptasirohi243401@$");
    const { _id } = decodeObject;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send(`ERROR: ${err.message}`);
  }
};

module.exports = { userAuth };
