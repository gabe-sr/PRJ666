import express from "express";
import mongoose from "mongoose";
import { isLogged } from "../middleware/auth.js";
import { User } from "../models/userModel.js";
import { RedefinePassword } from "../models/redefinePasswordModel.js";
import bcrypt from "bcryptjs";
import {
  transporter,
  mailOptionsRedefine,
} from "../email-notification/email.js";

import sendGridMail from "@sendgrid/mail";
import {} from "dotenv/config";
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);

const router = express.Router();

// ------- USER LOGIN  ------- //
router.post("/login", async (req, res) => {
  // response to be sent back to front end
  const response = {
    success: false,
    message: "",
    type: "",
    id: "",
    isActive: false,
  };

  // data received from the front end
  const { email: userEmail, password: userPassword } = req.body;

  try {
    // search DB for existing email
    const dbUser = await User.findOne({ email: userEmail });

    // this means that the email does not exist in DB
    if (!dbUser) {
      return res.send({
        ...response,
        message: "Wrong email and/or password.",
        type: "form",
      });
    }

    // now, compare the input password with the stored password in DB
    const passwordMatches = await bcrypt.compare(userPassword, dbUser.password);

    // if password is incorrect...
    if (!passwordMatches) {
      return res.send({
        ...response,
        message: "Wrong email and/or password.",
        type: "form",
      });
    }

    // if user is not activated, a message will be displayed
    if (dbUser.active === false) {
      return res.send({
        success: true,
        message: "User is not activated",
        type: "",
        id: dbUser._id,
        active: false,
      });
    }

    // if email exists and password is correct, proceed with session creation

    //add user info to the cookie
    req.session.userInfo = {
      user_id: dbUser._id.toString(),
      isAdmin: dbUser.isAdmin,
    };

    if (req.session.userInfo) {
      console.log("Session created");
      return res.send({
        success: true,
        message: "Session created",
        type: "",
        id: dbUser._id,
        active: true,
      });
    } else {
      console.error("Authentication error");
      return res.send({
        ...response,
        message: "Authentication error",
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// ------- AUTHENTICATION  ------- //
router.get("/", isLogged, async (req, res) => {
  try {
    const user = await User.findById(req.session.userInfo.user_id);
    res.send({ error: false, userData: user });
  } catch (err) {
    res.sendStatus(401);
  }
});

// ------- LOGOUT  ------- //
router.get("/logout", (req, res) => {
  //This destorys the session
  req.session.destroy();
  res.sendStatus(200);
});

// ------- REDEFINE PASSWORD (Forgot Password email)  ------- //
router.post("/redefine", async (req, res) => {
  // the body response to front end
  const response = {
    success: false,
  };

  // new model object
  let redefine = new RedefinePassword();

  const { email: userEmail } = req.body;

  try {
    const dbUser = await User.findOne({ email: userEmail });

    // this means that the email does not exist in the DB, so no email will be sent
    // however, in front end will just display that email was sent
    if (!dbUser) {
      return res.send({ success: true });
    }

    // check if threre is an active redefine password request on DB
    const check = await RedefinePassword.findOne({ email: userEmail });
    if (check) {
      return res.send({ success: true });
    }

    // if email exist, and there is no active redefine request, attempt to create a new one in DB
    redefine.email = userEmail;
    redefine = await redefine.save();

    // SEND EMAIL NOTIFICATION
    // transporter.sendMail(
    //   mailOptionsRedefine(dbUser.first_name, dbUser.email, redefine._id),
    //   (error, info) => {
    //     if (error) {
    //       return console.log(error);
    //     }
    //     console.log("Message sent: %s", info.messageId);
    //   }
    // );
    await sendGridMail.send(
      mailOptionsRedefine(dbUser.first_name, dbUser.email, redefine._id)
    );
    console.log("Message sent: %s", dbUser.email);

    response.success = true;
    res.send(response);

    // if any other error occurs, send an error message to front end
  } catch (err) {
    console.log(err);
    res.send(response);
  }
});

// ----- PUT: EDIT PASSWORD TO DB ------ //
router.put("/:id/changePassword", isLogged, async (req, res) => {
  // to store messages/errors
  const messages = [];

  // the body response to front end
  const response = {
    success: false,
    message: messages,
    redirectURL: `/dashboard/user/${req.body._id}/changePassword`,
    type: "",
  };

  // generate salt to hash password
  const salt = await bcrypt.genSalt(10);

  // hash password
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  console.log(`hash: ${hashPassword}`);

  var update = {
    password: hashPassword,
  };

  User.findOneAndUpdate(
    { _id: req.body._id },
    update,
    { new: true },
    function (error, doc) {
      if (error) {
        console.log(`Error on update: ${error}`);
      } else {
        console.log("user updated");
        console.log(doc);
        // send response to front end, with redirect information
        messages.push("Success");
        res.send({ ...response, success: true });
      }
    }
  );
});

// ------- REDEFINE PASSWORD (Get valid link)   ------- //
router.get("/redefine/:linkId", async (req, res) => {
  if (mongoose.isValidObjectId(req.params.linkId) === false) {
    res.sendStatus(404);
  } else {
    try {
      const redefinePass = await RedefinePassword.findById(req.params.linkId);

      if (!redefinePass) {
        res.sendStatus(404);
      } else {
        res.send({ email: redefinePass.email });
      }
    } catch (err) {
      console.log(err);
      res.sendStatus(404);
    }
  }
});

export { router };
