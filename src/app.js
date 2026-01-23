const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middleware/auth");

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cookieParser());

// SignUp API
app.post("/signup", async (req, res) => {
  try {
    // Validate the data
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;
    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create an new instance of user model.
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send(`ERROR : ${err.message}`);
  }
});

// login API
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Email is not present!");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 1 * 3600000),
      });

      res.send("Login Successfully!");
    } else {
      throw new Error("Password is not correct!");
    }
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

// profile API
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (error) {
    res.status(401).send(`ERROR: ${err.message}`);
  }
});

// sendConnectionRequest API
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(`${user.firstName} is sending a sendConnectionRequest.`);
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection is established!");
    app.listen(PORT, () => {
      console.log(`Server is successfully running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database can't be connected!");
  });
