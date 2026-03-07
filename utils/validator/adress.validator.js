import { body, param } from "express-validator";
import validatorMiddleware from "../../middleware/validator.middleware.js";

export const addAddressValidator = [
  body("alias")
    .notEmpty()
    .withMessage("Alias is required").custom(async(val)=>{
        const user = await UserModel.findById(req.user._id);
        if(user.addresses.some((address)=>address.alias === val)){
            throw new Error("Alias already exists");
        }
        return true;
    }),
    

  body("street")
    .notEmpty()
    .withMessage("Street is required"),

  body("city")
    .notEmpty()
    .withMessage("City is required"),

  body("zip")
    .optional()
    .isPostalCode("any")
    .withMessage("Invalid zip code"),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  validatorMiddleware,
];

export const removeAddressValidator = [
  param("addressId")
    .notEmpty()
    .withMessage("Address ID is required")
    .isMongoId()
    .withMessage("Invalid address ID"),

  validatorMiddleware,
];