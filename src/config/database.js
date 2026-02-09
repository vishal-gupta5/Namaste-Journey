const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vishal-guptaaa:vishal23mc32@namastenodejs.db8woif.mongodb.net/DevTinder",
  );
};

module.exports = connectDB;