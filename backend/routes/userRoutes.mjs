import express from "express";
import { registerUser, loginUser } from "../controllers/userController.mjs";
import { upload } from "../multer.mjs";
const router = express.Router();

router.route("/register").post(upload.single("pic"), registerUser);
router.route("/login").post(loginUser);
export default router;
