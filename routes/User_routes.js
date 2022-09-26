import express from "express";
import { sendPushNotification } from "../controllers/Admin.controller.js";
import { createUser, deleteUser, getAllUsers, getUser, updateUser, uploadAvatar } from "../controllers/User.controller.js";
import { checkProfile } from "../middlewares/User/checkExistsProfile.js";
import { checkUserExists } from "../middlewares/User/CheckExistsUser.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { verifyIdToken } from "../middlewares/verifyToken.js";
import { Mluter, uploadImageFirestore } from "../service/HandleUploadService.js";
const router = express.Router();
router.get('/getUser', verifyIdToken, getUser);
router.get('/getAllUsers', verifyAdmin, getAllUsers);
//upload image user
router.post('/uploadAvatar', [Mluter.single('avatar'), verifyIdToken, uploadImageFirestore], uploadAvatar);
router.post("/createUser",verifyIdToken, createUser);
router.put("/updateUser", verifyIdToken, updateUser);
router.delete("/deleteUser", checkUserExists, checkProfile, deleteUser);

//code for user
router.post("/send", sendPushNotification);
export default router;
