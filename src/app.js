const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
var jwt = require("jsonwebtoken");
const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cookieParser());

// Get User by an ID
app.get("/user", async (req, res) => {
  const id = req.body._id;

  try {
    const user = await User.findById(id);
    if (!user) {
      res.status(404).send("User not found!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// Get User by an emailId
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("User not found!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// Feed API - Get / Feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users.length) {
      res.send("Users not found!");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(404).send("Something went wrong!");
  }
});

// SignUp API
app.post("/signup", async (req, res) => {
  try {
    // Validate the data
    validateSignUpData(req);

    // Encrypt the password
    const { firstName, lastName, emailId, password } = req.body;
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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // Create a JWT token
      const token = await jwt.sign(
        { _id: user._id },
        "vishalguptasirohi243401@$",
      );
      // Add the token to the cookie and send the response back to the user
      res.cookie("token", token);

      res.send("Login Successfully!");
    } else {
      throw new Error("Password is not correct!");
    }
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

// profile API
app.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodeMessage = await jwt.verify(token, "vishalguptasirohi243401@$");
    const { _id } = decodeMessage;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User doesn't Exist!");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send(`ERROR: ${err.message}`);
  }
});

// Delete user by findOneAndDelete
app.delete("/user", async (req, res) => {
  const id = req.body._id;
  try {
    await User.findOneAndDelete(id);
    res.send("Deleted user successfully!");
  } catch (err) {
    res.status(400).send("Something went wrong!");
  }
});

// Update user by findOneAndUpdate
app.patch("/user/:_id", async (req, res) => {
  const id = req.params?._id;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoURL", "about", "gender", "age", "skills"];

    const IsUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!IsUpdateAllowed) {
      throw new Error("Update not Allowed!");
    }

    if (data.skills.length > 10) {
      throw new Error("Skills can't be more than 10!");
    }

    const user = await User.findByIdAndUpdate(id, data, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("User not found!");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Update Failed!", err.message);
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
