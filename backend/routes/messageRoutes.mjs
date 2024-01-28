import express from "express";
import { authorization } from "../middlewares/authMiddleware.mjs";
import { sendMessage, allMessages } from "../controllers/messageController.mjs";
import { upload } from "../multer.mjs";
const router = express.Router();

router
	.route("/sendmessage")
	.post(upload.single("image"), authorization, sendMessage);
router.get("/messages/:chatId", authorization, allMessages);

export default router;
