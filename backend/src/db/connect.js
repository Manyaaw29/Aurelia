const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✔ MongoDB Connected Successfully");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.warn("⚠️  Server will continue without database. Please check MongoDB Atlas Network Access settings.");
    console.warn("⚠️  Add your IP or 0.0.0.0/0 to the IP whitelist in Atlas.");
    // Don't exit - let server run without DB for frontend testing
  }
};

module.exports = connectDB;
