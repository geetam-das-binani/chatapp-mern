import express from "express";
import {
	fetchChats,
	createChat,
	createGroupChat,
	renameGroup,
	removeFromGroup,
	addToGroup,
} from "../controllers/chatController.mjs";
import { authorization } from "../middlewares/authMiddleware.mjs";
const router = express.Router();

router.route("/createchat").post(authorization, createChat);
router.route("/getallchats").get(authorization, fetchChats);
router.route("/groupcreate").post(authorization, createGroupChat);
router.route("/addToGroup").put(authorization, addToGroup);
router.route("/groupremove").put(authorization, removeFromGroup);
router.route("/renamegroup").put(authorization, renameGroup);
export default router;
