import express from "express";
import { sendPushNotification } from "../controllers/Admin.controller.js";
import { createProfile, deleteProfile, getProfileUser, updateProfile } from "../controllers/ProfileController.js";
import { createUser } from "../controllers/User.controller.js";
import { verifyIdToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.get("/getProfile",verifyIdToken, getProfileUser);
router.post("/createProfile",verifyIdToken, createProfile);
router.put("/updateProfile",verifyIdToken, updateProfile);
router.delete("/deleteProfile",verifyIdToken,deleteProfile);
//code for user
router.post("/send",sendPushNotification);
export default router;
