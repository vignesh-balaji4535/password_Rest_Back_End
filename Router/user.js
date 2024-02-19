import express from "express";
import { User } from "../models/user.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import { mail } from "../mails/Reg_Email.js";
import { sendOtpUser } from "../mails/OTP_mail.js";
import verifyToken from "../middle_war/Auth.js";
import newPass from "../middle_war/newpass.js";

const Router = express.Router();
Router.use(express.json());

//REGESTER ------->
Router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    return res.status(500).send("user already exist");
  }


  try {
    let salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(req.body.password, salt);
    let newUser = new User({ ...req.body, password: hashedPassword });

    mail(username, email);
    await newUser.save();
    res.send("registred successfully");
  } catch (error) {
    res.status(500).send("server error");
  }
});

//LOGIN---------->
Router.post("/login", async (req, res) => {
  const { username, email } = req.body;
  let login = await User.findOne({ email });

  if (!login) {
    return res.status(401).send("user doesn't exist");
  }

  const passwordMatching = await bcryptjs.compare(
    req.body.password,
    login.password
  );

  if (!passwordMatching) {
    return res.status(400).send("incorrect password");
  } else {
    const token = jwt.sign(
      { username: login.username, id: login._id },
      process.env.SECRECT_KEY,
      { expiresIn: "1d" }
    );
    return res.json(token);
  }
});

// home------->

Router.get("/home", verifyToken, (req, res) => {
  res.json({ message: `Wellcome ,${req.body.email}` });
});

// password reset with email verification with OTP through mail

Router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).send("Invalid User or Email");
    }

    const hideToken = jwt.sign(
      { token: Math.random().toString().slice(-4) },
      process.env.SECRECT_KEY,
      { expiresIn: "5m" }
    );

    user.resetPasswordToken = hideToken;
    user.resetPasswordExp = Date.now() + 36000000;

    await user.save();

    sendOtpUser(user);

    return res.status(200).send({
      message: "otp sent",
      token: hideToken,
      date: user.resetPasswordExp,
    });
  } catch (error) {
    return res.status(500).send(error.message);
  }
});

// Set otp Token  and validating otp

Router.post("/forgot/:token", newPass, async (req, res) => {
  const { token } = req.params;
  const { otp } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
    });
    if (!user) {
      return res.status(401).send("Invalid Token");
    }

    const otpToken = user.resetPasswordToken;

    const { token: token1 } = jwt.verify(otpToken, process.env.SECRECT_KEY);


    if (otp == token1) {
      return res.status(200).send("Correct OTP");
    } else {
      return res.status(400).send("Incorrect OTP");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

// Resetting Pass word

Router.post("/forgot/:token/newpass", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
    });

    const hashedPassword = await bcryptjs.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExp = null;

    await user.save();

    return res.status(200).send("updated successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

export const UserRouter = Router;
