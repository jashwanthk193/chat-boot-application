import express from "express";
import {  sendMessage,getChatBetweenUsers,getMessagesByReceiver} from "../controller/messageController.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";
const router = express.Router();

// ✅ Save a new message
router.post("/", sendMessage);

// ✅ Fetch chat history between two users
// router.get("/:senderId/:receiverId", getMessages);
router.get("/chat/:userId/:receiverId", getChatBetweenUsers);
router.get("/receiver/:receiverId", getMessagesByReceiver);
// console.log("✅ Message routes loaded");

export default router;
