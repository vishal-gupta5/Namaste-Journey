const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/User")
const app = express();
const PORT = 4000;


app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "Aryan",
        lastName: "Gupta",
        emailId: "aryan@gmail.com",
        password: "aryan123@"
    })

    await user.save();
    res.send("User added successfully!")
})



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
