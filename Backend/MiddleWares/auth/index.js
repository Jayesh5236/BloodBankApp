import { body, validationResult } from "express-validator";
import userModel from "../../Models/userModel/usermodel.js";

const validateUser = [
  body("role")
    .isString()
    .notEmpty()
    .isIn(["admin", "organisation", "user", "hospital"])
    .withMessage("Invalid role"),

  body("name")
    .if(body("role").isIn(["user", "admin"]))
    .isString()
    .notEmpty()
    .withMessage("Name is required for user or admin roles"),

  body("organisationName")
    .if(body("role").equals("organisation"))
    .isString()
    .notEmpty()
    .withMessage("Organisation name is required for organisation role"),

  body("hospitalName")
    .if(body("role").equals("hospital"))
    .isString()
    .notEmpty()
    .withMessage("Hospital name is required for hospital role"),

  body("email")
    .isString()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const existingUser = await userModel.findOne({ email: value });
      if (existingUser) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  body("password").isString().notEmpty().withMessage("Password is required"),

  body("website").optional().isString(),

  body("address").isString().notEmpty().withMessage("Address is required"),

  body("phone")
    .isString()
    .notEmpty()
    .isMobilePhone()
    .withMessage("Invalid phone number format")
    .custom(async (value) => {
      const existingUser = await userModel.findOne({ phone: value });
      if (existingUser) {
        throw new Error("Phone number already exists");
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

function errorMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ error: errors.array() });
}

export { validateUser, errorMiddleware };
