const mongoose = require("mongoose");

const connectionString = process.env.MONGOLAB_URI;
const database = process.env.MONGODB;

// MongoDB Connection Pools
const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 490, // Maintain up to 10 socket connections. Mongo free is 500 Max
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
  useUnifiedTopology: true,
  useNewUrlParser: true,
  dbName: database,
};

mongoose
  .connect(connectionString, options)
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch((err) => console.log("Error:", err));
