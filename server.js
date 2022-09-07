import {app} from "./index.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connect = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then(() => {
        console.log("Connected to MongoDB successfully");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("Disconnectd", () => {
  console.log("Disconnected from MongoDB");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  connect();
  console.log(`server is running on port ${PORT}`);
});
