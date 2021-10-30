import express from "express";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Booking } from "../models/bookingModel.js";
import { Room } from "../models/roomModel.js";
import { isLogged, isAuthenticated } from "../middleware/auth.js"; // authentication middlewares
const router = express.Router();

// ----- GENERATE USER REPORTS ------ //
// far from being efficient... but it works
router.get("/users", async (req, res) => {
  let { name, startDate, endDate, room, sort } = req.query;
  var sDate, eDate;
  if (name) {
    name = req.query.name.toLowerCase();
  }

  if (!startDate) {
    sDate = new Date("2021-01-01");
  } else {
    sDate = new Date(startDate);
  }

  if (!endDate) {
    eDate = new Date("2100-01-01");
  } else {
    eDate = new Date(endDate);
    eDate.setTime(
      eDate.getTime() + 23 * 60 * 60 * 1000 + 59 * 60 * 1000 + 59 * 1000 + 999
    );
  }

  if (!sort) {
    sort = "byUser";
  }

  let fetchedUsers = [];
  let fetchedRooms = [];
  let users = [];
  let data = [];

  // attempt to fetch users based on query params
  try {
    fetchedUsers = await User.find({
      $or: [
        { first_name: { $regex: new RegExp(name, "gi") } },
        { last_name: { $regex: new RegExp(name, "gi") } },
      ],
    });

    // get only some data from user
    fetchedUsers.map((u) => {
      const { _id: user_id, first_name, last_name, email } = u;
      users.push({ user_id, first_name, last_name, email });
    });
  } catch (err) {
    console.log(err);
  }

  // fetch all rooms
  try {
    fetchedRooms = await Room.find();
  } catch (err) {
    console.log(err);
  }

  // fetch user bookings
  try {
    users = await Promise.all(
      users.map(async (u) => {
        try {
          let fetchedBookings = await Booking.find({
            user_id: u.user_id,
            booking_date: {
              $gte: sDate,
              $lte: eDate,
            },
          });

          // include room information in the booking object (flatten data)
          fetchedBookings.map((b) => {
            let { _id: booking_id, booking_date, room_id } = b;
            let room = fetchedRooms.find((r) => r._id.equals(room_id));
            let {
              description: room_description,
              price: room_price,
              name: room_name,
            } = room;

            data.push({
              ...u,
              booking_id,
              booking_date,
              room_id,
              room_name,
              room_description,
              room_price,
            });
          });

          // u = { ...u, bookings: bookings };

          // bookings.map((e) => {
          //   data.push({ ...u, ...bookings });
          // });

          //return u;
        } catch (err) {
          console.log(err);
        }
      })
    );
  } catch (err) {
    console.log(err);
  }

  return res.send(data);
});

export { router };
