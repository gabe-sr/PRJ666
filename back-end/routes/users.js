//This module allows you to pefrom CRUD operations on the User colections
import express from "express";
import { User } from "../models/userModel.js";
const router = express.Router();
import bcrypt from "bcryptjs"; // to hash passwords
import { isAuthenticated } from "../middleware/auth.js"; // authentication middlewares
import fetch from "node-fetch"; // authentication middlewares

// -------- ROUTES DEFINITIONS -------- //

// Get all users in DB
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ fist_name: "desc" });
    res.send(users);
    //link to front end, sending object(array)
  } catch (err) {
    console.log(err);
  }
});

// **** USE THIS FOR TESTING, NO AUTH **** //
router.get("/test/:id", async (req, res) => {
  try {
    console.log(JSON.stringify(req.params.id));
    // const user = await User.findOne({ user_id: req.params.user_id })
    const user = await User.findById(req.params.id);
    res.send(user);
    //link to front end, sending object
    console.log(user);
  } catch (err) {
    console.log(err);
  }
});

// Get one user by id
router.get("/:id", isAuthenticated, async (req, res) => {
  try {
    console.log(JSON.stringify(req.params.id));
    // const user = await User.findOne({ user_id: req.params.user_id })
    const user = await User.findById(req.params.id);
    res.send(user);
    //link to front end, sending object
    console.log(user);
  } catch (err) {
    console.log(err);
  }
});

// Get for edit route
router.get("/edit/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  //link to front end, sending object
});

// Get one user by user_id (!=id) (WIP)
// router.get('/:first_name', async (req,res) =>{
//     try {
//         console.log( req.params.user_id )
//         // const user = await User.findOne({ user_id: req.params.user_id })
//         const user = await User.findOne( { first_name: req.params.first_name} ) //possible to search by name, but not by user_id
//         // res.send(user)
//         console.log(user)
//     } catch (err) {
//         console.log(err)
//     }
// })

// --- POST user to db --- //
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

// --- USER LOGIN  --- //
router.post("/login", async (req, res) => {
  // response to be sent back to front end
  const response = {
    success: false,
    message: "",
    type: "",
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
        type: "email",
        data: dbUser,
      });
    }

    // now, compare the input password with the stored password in DB
    const passwordMatches = await bcrypt.compare(userPassword, dbUser.password);

    // if password is incorrect...
    if (!passwordMatches) {
      return res.send({
        ...response,
        message: "Wrong email and/or password.",
        type: "password",
      });
    }

    // if email exists and password is correct, proceed with session creation

    // if user is a normal user (not an admin)
    if (dbUser.isAdmin === false) {
      //add user_id to cookie
      req.session.userInfo = { user_id: dbUser._id };

      // **** temporary for testing **** //
      res.redirect(`${dbUser._id}`);
    }

    // TO-DO: crate admin session
    //....
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
    res.send({ success: true, activeStatus: user.active });
  } catch (err) {
    res.send({ success: false });
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    (user.user_id = req.body.user_id),
      (user.active = req.body.active),
      (user.first_name = req.body.first_name),
      (user.last_name = req.body.last_name),
      (user.loginStatus = req.body.loginStatus),
      (user.crp_no = req.body.crp_no),
      (user.email = req.body.email),
      (user.phone = req.body.phone),
      (user.address = req.body.address),
      (user.dob = req.body.dob),
      (user.password = req.body.password),
      (user.dateCreated = req.body.dateCreated),
      (user.cpf_no = req.body.cpf_no),
      (user.methodology = req.body.methodology);

    user = await user.save();
    res.redirect(`/users/${user._id}`);
  } catch (err) {
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
