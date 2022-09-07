import express from "express";
import { checkObbCodeResetPassword, forgotPassword, removeAdmin, revokeToken, sendEmailResetPassword, setAdmin, verifyResetPassword } from "../controllers/Admin.controller.js";
import { signinWithEmailAndPassword, signupWithEmailAndPassword } from "../controllers/auth.controller.js";
import verifyAdmin from "../middlewares/verifyAdmin.js";
import { verifyIdToken } from "../middlewares/verifyToken.js";
const router = express.Router();

router.post('/signup',signupWithEmailAndPassword);
router.post('/signin',signinWithEmailAndPassword);
router.post('/forgot-password', forgotPassword);
router.post('/sendEmailResetPassword',sendEmailResetPassword);
router.post('/checkObbCodeResetPassword',checkObbCodeResetPassword);
router.post('/verifyResetPassword',verifyResetPassword);

export default router;
