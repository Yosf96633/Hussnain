import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/authController.js";
import validateRegister from "../middlewares/validateRegister.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", validateRegister, registerUser);
router.post("/login" , loginUser)
router.post("/logout" , verifyToken , logoutUser)

export default router;
