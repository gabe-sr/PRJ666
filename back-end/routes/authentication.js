import express from "express";
import { isLogged } from "../middleware/auth.js";
import { User } from "../models/userModel.js";

const router = express.Router();

// AUTHENTICATION ROUTE
router.get("/", isLogged, async (req, res) => {
  try {
    const user = await User.findById(req.session.userInfo.user_id);
    console.log(user);
    res.send({ error: false, userData: user });
  } catch (err) {
    res.sendStatus(401);
  }
});

// LOGOUT ROUTE
router.get("/logout", (req, res) => {
  //This destorys the session
  req.session.destroy();
  res.sendStatus(200);
});

export { router };
