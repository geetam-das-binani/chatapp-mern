import express from "express";
import { authorization } from "../middlewares/authMiddleware.mjs";
import { sendMessage, allMessages } from "../controllers/messageController.mjs";
const router = express.Router();

router.post("/sendmessage", authorization, sendMessage);
router.get("/messages/:chatId", authorization, allMessages);

export default router;
