import { defaultAuth } from "../config/firebase-admin.js";
import { createError } from "../utils/error.js";

const verifyAdmin = async (req, res, next) => {
  let token = req.header("Authorization").replace("Bearer ", "");
  try {
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
    next();
  } catch (error) {
    res.status(500).send({
      message: "Something went wrong",
      error: error.message,
    });
  }
  // const { uid } = req.user;
  // const user = await defaultAuth.getUser(uid);
  // if (!user.customClaims.admin) {
  //   throw createError(403, "You are not authorized to perform this action");
  // }
  // next();
};
export default verifyAdmin;
