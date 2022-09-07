import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import User_routes from "./routes/User_routes.js";
import Profile_routes from "./routes/Profile_routes.js";
import * as swagger from "swagger-ui-express";
import swaggerDocument from "./swaggerDocument.json" assert { type: "json" };

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());                                     
app.use(cors());
app.use('/api-docs/v2', swagger.serve);
app.get('/api-docs/v2', swagger.setup(swaggerDocument));


app.use("/api/user", User_routes);
app.use("/api/profile", Profile_routes);

export { app};
