import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import User_routes from "./routes/User_routes.js";
import Profile_routes from "./routes/Profile_routes.js";
const app = express();
app.use(bodyParser.json());
app.use(cors());
dotenv.config();

app.use("/api/user", User_routes);
app.use("/api/profile", Profile_routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    connect();
    console.log(`server is running on port ${PORT}`);
});
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

