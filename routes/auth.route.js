import express from "express";

import {
  signup,
  Login,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} from "../services/auth.service.js";
import {
  signupValidator,
  loginValidator,
} from "../utils/validator/auth.validator.js";

const router = express.Router();

router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, Login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyResetCode", verifyResetCode);
router.put("/resetPassword", resetPassword);

export default router;
