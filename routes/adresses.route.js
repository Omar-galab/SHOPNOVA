import express from "express";
import { protect, allowTo } from "../services/auth.service.js";
import { addAddress, removeAdress, getAddresses, updateAddress } from "../services/addresses.service.js";
import { addAddressValidator, removeAddressValidator } from "../utils/validator/adress.validator.js";

const router = express.Router();

router.use(protect, allowTo("user"));

router.post("/", addAddressValidator, addAddress);
router.delete("/:addressId", removeAddressValidator, removeAdress);
router.get("/", getAddresses);  
router.put("/:addressId", updateAddress);   

export default router;