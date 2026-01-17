const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://vishal-guptaaa:EPhHvgDqMvm62VMD@namastenodejs.db8woif.mongodb.net/DevTinder",
  );
};

module.exports = connectDB;