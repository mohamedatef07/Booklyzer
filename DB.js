const mongoose = require("mongoose");
require("dotenv").config();
const connectionString = process.env.connectionString;
const connectDB = async () => {
  try {
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Database Connection Error".error.message);
    process.exit(1);
  }
};
module.exports = { connectDB };
