import express from "express";
import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Booking } from "../models/bookingModel.js";
import { Room } from "../models/roomModel.js";
import { isLogged, isAuthenticated } from "../middleware/auth.js"; // authentication middlewares
const router = express.Router();

// ----- GENERATE USER REPORTS ------ //
// far from being efficient... but it works
router.get("/users", isLogged, isAuthenticated, async (req, res) => {
  try {
    let {
      name,
      startDate,
      endDate,
      startTime,
      endTime,
      room: roomQuery,
      sort,
      maxrows,
      startpage,
    } = req.query;

    // Validate incoming data
    let sPage = parseInt(startpage);
    let mRows = parseInt(maxrows);
    let sDate, eDate;
    let fullName = null;
    let hasfullName = false;

    if (name) {
      name = req.query.name.toLowerCase().trim();
      fullName = name.split(" ");
      if (fullName.length > 1) {
        hasfullName = true;
      }
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

    startTime = parseInt(startTime);
    endTime = parseInt(endTime);

    if (!startTime) {
      startTime = 8;
    }

    if (!endTime || endTime < startTime) {
      endTime = 19;
    }

    if (!sort || (sort != "byName" && sort !== "byDate")) {
      sort = "byName";
    }

    if (!roomQuery) {
      roomQuery = "0";
    }

    // Prepare to fetch data...
    let fetchedUsers = [];
    let fetchedRooms = [];
    let users = [];
    let data = [];

    // attempt to fetch users based on query params
    try {
      if (hasfullName === false) {
        fetchedUsers = await User.find({
          $or: [
            { first_name: { $regex: new RegExp(name, "gi") } },
            { last_name: { $regex: new RegExp(name, "gi") } },
          ],
        });
      } else {
        fetchedUsers = await User.find({
          $and: [
            { first_name: { $regex: new RegExp(fullName[0], "gi") } },
            { last_name: { $regex: new RegExp(fullName[1], "gi") } },
          ],
        });
      }

      // select relevant user data to be displayed
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

              // get time and filter
              let time = new Date(booking_date).getUTCHours();
              if (time >= startTime && time <= endTime) {
                if (roomQuery === "0" || roomQuery === room_id.toString())
                  data.push({
                    ...u,
                    booking_id,
                    booking_date,
                    time,
                    room_id,
                    room_name,
                    room_description,
                    room_price,
                  });
              }
            });
          } catch (err) {
            console.log(err);
          }
        })
      );
    } catch (err) {
      console.log(err);
    }

    // Sorting and Filtering data before sending to front-end
    const dataTotal = data.length;

    // Sorting...
    if (sort === "byName") {
      data = data.sort((a, b) => {
        if (a.first_name.toLowerCase() === b.first_name.toLowerCase()) {
          if (a.booking_date === b.booking_date) {
            return a.time - b.time;
          }

          return a.booking_date - b.booking_date;
        }
        var nameA = a.first_name.toLowerCase();
        var nameB = b.first_name.toLowerCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        // names must be equal
        return 0;
      });
      const dataDB = {
        values: data.slice(sPage, sPage + mRows),
        total: dataTotal,
      };
      return res.send(dataDB);
    }

    if (sort === "byDate") {
      data.sort((a, b) => {
        if (a.booking_date === b.booking_date) {
          var nameA = a.first_name.toLowerCase();
          var nameB = b.first_name.toLowerCase();

          if (a.first_name.toLowerCase() === b.first_name.toLowerCase()) {
            return a.time - b.time;
          }
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }

          // names must be equal
          return 0;
        }

        return a.booking_date - b.booking_date;
      });
      const dataDB = {
        values: data.slice(sPage, sPage + mRows),
        total: dataTotal,
      };
      return res.send(dataDB);
    }
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

export { router };
