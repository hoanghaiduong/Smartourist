import { defaultAuth } from "../config/firebase-admin.js";
import { createError } from "../utils/error.js";

const verifyAdmin = async (req, res, next) => {
 
  try {
    let token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
  
      res.status(401).send({
        message: "No Tokens provided"
      });
    }
    const decodedToken = await defaultAuth.verifyIdToken(token);
    if (!decodedToken.admin) {
      res.status(403).send("You are not an admin");
    }
    req.user = decodedToken;
    req.userId= decodedToken.uid;
    next();
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message +"||" +"TOKEN IS REQUIRED",
    });
  }

};
export default verifyAdmin;
