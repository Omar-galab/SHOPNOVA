import express from "express";

import { signup, Login, forgotPassword } from "../services/auth.service.js";
import {
  signupValidator,
  loginValidator,
} from "../utils/validator/auth.validator.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, Login);
router.post("/forgotPassword", forgotPassword);

export default router;
