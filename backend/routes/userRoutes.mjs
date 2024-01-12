import express from "express";
import {
	registerUser,
	loginUser,
	allUsers,
} from "../controllers/userController.mjs";
import { upload } from "../multer.mjs";
import { authorization } from "../middlewares/authMiddleware.mjs";
const router = express.Router();

router.route("/register").post(upload.single("pic"), registerUser);
router.route("/login").post(loginUser);
router.route("/allusers").get(authorization, allUsers);
export default router;
