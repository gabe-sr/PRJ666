//This module allows you to pefrom CRUD operations on the User colections
import express from "express";
import { User } from "../models/userModel.js";
const router = express.Router();
import bcrypt from "bcryptjs"; // to hash passwords
import { isLogged, isAuthenticated } from "../middleware/auth.js"; // authentication middlewares
import fetch from "node-fetch"; // authentication middlewaresimport { transporter } from "../email-notification/email.js";
import { RedefinePassword } from "../models/redefinePasswordModel.js";
import {
  transporter,
  mailOptionsReview,
  mailOptionsApprove,
} from "../email-notification/email.js";

// -------- ROUTES DEFINITIONS -------- //

// ----- GET ALL USERS IN DB ------ //
router.get("/", isLogged, isAuthenticated, async (req, res) => {
  try {
    const users = await User.find().sort({ fist_name: "desc" });
    res.send(users);
    //link to front end, sending object(array)
  } catch (err) {
    console.log(err);
  }
});

// ----- GET ONE USER BY ID ------ //
router.get("/:id", isLogged, isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.send({
        error: true,
        type: "404",
      });
    } else {
      res.send(user);
    }
  } catch (err) {
    if (err.name === "CastError") {
      return res.send({
        error: true,
        type: "404",
      });
    } else {
      return res.sendStatus(500);
    }
  }
});

// Get for edit route
router.get("/edit/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
});

// ----- PUT: EDIT USER TO DB ------ //
router.put("/edit/:id", async (req, res) => {
  // to store messages/errors
  const messages = [];

  // the body response to front end
  const response = {
    success: false,
    message: messages,
    redirectURL: `/dashboard/user/${req.body._id}`,
    type: "",
  };

  var update = {
    phone: req.body.phone,
    dob: req.body.dob,
    zip: req.body.zip,
    city: req.body.city,
    state: req.body.state,
    address1: req.body.address1,
    address2: req.body.address2,
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

// ----- POST EDIT USER TO DB ------ //
router.post("/edit/:id", async (req, res) => {
  // to store messages/errors
  const messages = [];

  // the body response to front end
  const response = {
    success: false,
    message: messages,
    redirectURL: `/user/${req.body._id}`,
    type: "",
  };

  User.findOne({ _id: req.body._id })
    .then(() => {
      console.log("user found");
      User.updateOne(req.body).catch((error) => {
        console.log(error);
      });
      console.log("user updated");
      // send response to front end, with redirect information
      messages.push("Success");
      res.send({ ...response, success: true });
    })
    .catch((err) => {
      console.log(err);
      messages.push("A problem has occurred...");
      res.send(response);
    });
});

// ----- POST USER TO DB ------ //
router.post("/", async (req, res) => {
  // to store messages/errors
  const messages = [];

  // the body response to front end
  const response = {
    success: false,
    message: messages,
    redirectURL: "/signup",
    type: "",
  };

  // new userModel object
  let user = new User({
    ...req.body,
  });

  try {
    // search DB for existing email
    const userFound = await User.findOne({ email: user.email });

    // this means that the email already exists in DB
    if (userFound) {
      messages.push(
        "The email address is already in use. Please try again or login into your account."
      );
      res.send({ ...response, type: "email" });
    } else {
      // generate salt to hash password
      const salt = await bcrypt.genSalt(10);

      // hash password
      user.password = await bcrypt.hash(user.password, salt);

      // save user in DB
      user = await user.save();
      console.log(user);

      // SEND EMAIL NOTIFICATION
      transporter.sendMail(
        mailOptionsReview(`${user.email}`, `${user.first_name}`),
        (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        }
      );

      // send response to front end, with redirect information
      messages.push("Success");
      res.send({ ...response, success: true });
    }

    // if any other error occurs, send an error message to front end
  } catch (err) {
    console.log(err);
    messages.push("A problem has occurred...");
    res.send(response);
  }
});

// ------- USER LOGIN  ------- //
router.post("/login", async (req, res) => {
  // response to be sent back to front end
  const response = {
    success: false,
    message: "",
    type: "",
    id: "",
  };
  console.log(req.body);
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

    // if email exists and password is correct, proceed with session creation

    // if user is a normal user (not an admin)
    // if (dbUser.isAdmin === false) {
    console.log(dbUser._id.toString());
    //add user_id to cookie
    req.session.userInfo = { user_id: dbUser._id.toString() };

    if (req.session.userInfo) {
      console.error("Session created");
      return res.send({
        success: true,
        message: "Session created",
        type: "",
        id: dbUser._id,
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

// --- AUTHORIZATION: UPDATE STATUS  --- //
// searchs the database by ID and update the active property
// the response is a success status and the updated authorization status
router.patch("/update_authorize/:id", async (req, res) => {
  try {
    let user = await User.findOneAndUpdate(
      { _id: req.params.id },
      { active: req.body.active },
      { new: true }
    );

    // send email if user has been approved (status changed from inactive to active)
    if (user.active) {
      // SEND EMAIL NOTIFICATION
      transporter.sendMail(
        mailOptionsApprove(`${user.email}`, `${user.first_name}`),
        (error, info) => {
          if (error) {
            return console.log(error);
          }
          console.log("Message sent: %s", info.messageId);
        }
      );
    }

    res.send({ success: true, activeStatus: user.active });
  } catch (err) {
    res.send({ success: false });
    console.log(err);
  }
});

// --- REDEFINE USER PASSWORD  --- //

router.patch("/redefine_password", async (req, res) => {
  let { password, email, confirmPassword } = req.body.values;

  if (password !== confirmPassword) {
    return res.send({ success: false });
  }

  try {
    // generate salt to hash password
    const salt = await bcrypt.genSalt(10);

    // hash password
    password = await bcrypt.hash(password, salt);

    let user = await User.findOneAndUpdate(
      { email: email },
      { password: password },
      { new: true }
    );

    if (!user) {
      res.send({ success: false });
    } else {
      // try to de-activate "reset password" link (remove from DB), if exists
      await RedefinePassword.findOneAndDelete({ email: email });

      res.send({ success: true });
    }
  } catch (err) {
    res.send({ success: false });
    console.log(err);
  }
});

// --- TEST POST TO SUBMIT DATA TO DATABASE ---//
// takes data from mockaroo dataset at mockaroo URL
// pass the URL in the post body
router.post("/upload_data/", async (req, res) => {
  let data = [];
  let url = req.body.url;

  // get data from mockaroo dataset
  try {
    const response = await fetch(url); // from the url that is passed in the post body
    data = await response.json();

    // append password
    data.map((user) => {
      user.password = "12345678Ab"; // <------ DEFAULT PASSWORD
    });
  } catch (err) {
    console.log(err);
  }

  let count = 0; // number of users added

  await Promise.all(
    data.map(async (dat) => {
      let user = new User(dat);

      try {
        // search DB for existing email
        const userFound = await User.findOne({ email: user.email });

        // this means that the email is unique
        if (!userFound) {
          // generate salt to hash password
          const salt = await bcrypt.genSalt(10);

          // hash password
          user.password = await bcrypt.hash(user.password, salt);

          // save user in DB
          user = await user.save();
          count++;
        }

        // if any other error occurs, send an error message to front end
      } catch (err) {
        console.log(err);
      }
    })
  );

  const message = `${count} USERS ADDED TO THE DATABASE!`;
  console.log(message);
  res.send(message);
});

export { router };
