const express = require("express");
const { userAuth } = require("../middleware/auth");
const profileRouter = express.Router();

// profile API
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send(`ERROR: ${err.message}`);
  }
});

module.exports = profileRouter