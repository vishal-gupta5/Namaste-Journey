const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User");
const app = express();
const PORT = 4000;

app.use(express.json());

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
  const user = new User(req.body);

  try {
    await user.save();
    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("Error saving the user: ", err.message);
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
    const ALLOWED_UPDATES = [
      "photoURL",
      "about",
      "gender",
      "age",
      "skills",
    ];

    const IsUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k),
    );

    if (!IsUpdateAllowed) {
      throw new Error("Update not Allowed!");
    }

    if(data.skills.length > 10) {
      throw new Error("Skills can't be more than 10!")
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
