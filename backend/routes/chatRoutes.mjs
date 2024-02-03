import express from "express";
import {
	fetchChats,
	createChat,
	createGroupChat,
	renameGroup,
	removeFromGroup,
	addToGroup,
	leaveGroup,
} from "../controllers/chatController.mjs";
import {
	authentication,
	authorization,
} from "../middlewares/authMiddleware.mjs";
const router = express.Router();

router.route("/createchat").post(authorization, createChat);
router.route("/getallchats").get(authorization, fetchChats);
router.route("/groupcreate").post(authorization, createGroupChat);
router
	.route("/addToGroup")
	.put(authorization, authentication(true), addToGroup);
router
	.route("/groupremove")
	.put(authorization, authentication(true), removeFromGroup);
router.route("/renamegroup").put(authorization, renameGroup);
router.route("/leavegroup").put(authorization, leaveGroup);
export default router;
