const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Token is invalid!!!");
    }

    const decodeObject = await jwt.verify(token, "vishalguptasirohi243401@$");
    const { _id } = decodeObject;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found!");
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(`ERROR: ${err.message}`);
  }
};

module.exports = { userAuth };
