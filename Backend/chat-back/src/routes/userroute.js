import express from "express";
import {
  getAllUsers
 
} from "../controller/usercontroller.js";
import { authenticateJWT } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/", authenticateJWT, getAllUsers);




export default router;
