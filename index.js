import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import User_routes from "./routes/User_routes.js";
import Profile_routes from "./routes/Profile_routes.js";
const app = express();
app.use(bodyParser.json());
app.use(cors());


app.use("/api/user", User_routes);
app.use("/api/profile", Profile_routes);

export default app;
