import { defaultApp, defaultAuth } from "../config/firebase-admin.js";
import { createError } from "../utils/error.js";

const verifyIdToken = async (req, res, next) => {

  try {
    let token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      res.status(401).send({
        message: "No token provided"
      });
    }
    const decodedToken = await defaultAuth.verifyIdToken(token);
    req.user = decodedToken;
    req.userId=decodedToken.uid;
    next();
  } catch (error) {
   
    res.status(401).send({
      message: "Invalid token" ,
      error: error.message
    });
  }
};
export  {verifyIdToken};
