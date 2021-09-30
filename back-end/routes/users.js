//This allows you to pefrom CRUD operations on the User colections
import express from "express";
// const express = require("express")
import { User } from "../models/userModel.js";
// const User = require("../models/userModel")
const router = express.Router();
// to hash passwords
import bcrypt from "bcryptjs";

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

// Get one user by id
router.get("/:id", async (req, res) => {
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
  // to store errors
  const errors = [];

  // the body response to front end
  const body = { success: true, errorMessage: [], redirectUrl: "" };

  // new userModel object
  let user = new User({
    ...req.body,
  });

  try {
    // search DB for existing email
    const userFound = await User.findOne({ email: user.email });

    // this means that the email already exists in DB
    if (userFound) {
      errors.push(
        "The email address is already in use. Please try again or login into your account."
      );
      res.send({ ...body, success: false, errorMessage: errors });
    } else {
      // generate salt to hash password
      const salt = await bcrypt.genSalt(10);

      // hash password
      user.password = await bcrypt.hash(user.password, salt);

      // save user in DB
      user = await user.save();
      console.log(user);

      // send response to front end, with redirect information
      res.send({ ...body, redirectURl: "/" });

      //res.redirect(`/users/${user._id}`); // temporary (after saving user in db exibit it (afterwards it will redirect to user area)
    }
  } catch (err) {
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

export { router };
