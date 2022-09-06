import express from "express";
import { sendPushNotification } from "../controllers/Admin.controller.js";
import { createProfile, deleteProfile, getProfileUser, updateProfile } from "../controllers/ProfileController.js";
import { createUser } from "../controllers/User.controller.js";
import { verifyIdToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.get("/getProfile", getProfileUser);
router.post("/createProfile", createProfile);
router.put("/updateProfile", updateProfile);
router.delete("/deleteProfile",deleteProfile);
//code for user
router.post("/send",sendPushNotification);
export default router;
