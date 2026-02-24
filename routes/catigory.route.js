import express from "express";
import { getCategories } from "../services/catigory.service.js";
import e from "express";

const router = express.Router();

router.get("/", getCategories);

export default router;
