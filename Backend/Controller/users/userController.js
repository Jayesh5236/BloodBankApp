import express from "express";
import bcrypt from "bcryptjs";
import usermodel from "../../Models/userModel/usermodel.js";
import { errorMiddleware, validateUser } from "../../MiddleWares/auth/index.js";
import generateToken from "../../MiddleWares/validation/generateToken.js";

const router = express.Router();

/*
    API: Register User
    Method : POST
    Desc : User signup
    Access Type : Public
*/

router.post("/register", validateUser, errorMiddleware, async (req, res) => {
  try {
    const exitingUser = await usermodel.findOne({ email: req.body.email });
    if (exitingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Exists",
      });
    }

    const phoneFound = await usermodel.findOne({ phone: req.body.phone });
    if (phoneFound) {
      return res.status(409).send({
        success: false,
        message: "Number Already Registered",
      });
    }

    req.body.password = await bcrypt.hash(req.body.password, 12);

    const user = new usermodel(req.body);

    await user.save();

    return res.status(200).send({
      success: true,
      message: "User Registered SuccessFully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
});

/*
    API: Login User
    Method : POST
    Desc : User Login
    Access Type : Public
*/

router.post("/login", async (req, res) => {
  try {
    const userFound = await usermodel.findOne({ email: req.body.email });
    if (!userFound) {
      return res.status(404).send({
        success: false,
        message: "User Not Found",
      });
    }

    const isValid = await bcrypt.compare(req.body.password, userFound.password);

    if (!isValid) {
      return res.status(404).send({
        success: false,
        message: "Incorrect Credentials",
      });
    }

    let payload = { email: userFound.email, _id: userFound._id };

    let token = generateToken(payload);

    res.status(200).send({
      success: true,
      message: "Log In SuccessFull",
      token,
      userFound,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error In Register API",
      error,
    });
  }
});

export default router;
