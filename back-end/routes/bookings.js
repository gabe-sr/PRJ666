import express from "express";
import { Booking } from "../models/bookingModel.js";
const router = express.Router();

//Get all bookings
router.get("./", async (req, res) => {
  try {
    const bkns = await Booking.find().sort({ createdAt: "desc" });
    res.send(bkns);
  } catch (err) {
    console.log(err);
  }
});

//Get bookings by id
router.get("/:", async (req, res) => {
  try {
    const bkns = await Booking.findById(req.params.id);
    res.send(user);
  } catch (err) {
    console.log(err);
  }
});

//Post booking to db
router.post("/", async (req, res) => {
  const booking = new Booking({ ...req.body }); //deconstruct request to booking
  //check if booking already exists, inform user (see users.js POST method good practice)
  try {
    booking = await booking.save(); //validations should be exec in the backend, frontend or both?
  } catch (err) {
    console.log(err);
  }
});

//No route to update booking

//Delete booking on db, we still need to decide wether we are actually deleting bookings, or just flagging as deleted
router.delete("/:id", async (req, res) => {
  try {
    //inform user (see users.js POST method good practice)
    await Booking.findByIdAndDelete(req.params.id);
  } catch (err) {
    Console.log(err);
  }
});

export { router };
