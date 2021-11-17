import express from "express";
import { User } from "../models/userModel.js";
import { Booking } from "../models/bookingModel.js";
import { Room } from "../models/roomModel.js";
import { isLogged, isAuthenticated } from "../middleware/auth.js"; // authentication middlewares
const router = express.Router();

// --------------- GENERATE MONTHLY TOTAL REPORT ----------------- //

router.get("/monthlytotal", isLogged, isAuthenticated, async (req, res) => {
  try {
    let { name, year, month, sort } = req.query;

    // Validate incoming data
    year = parseInt(year);
    month = parseInt(month);
    let fullName = null;
    let hasName = false;
    let fetchedUsers = [];

    // validate name
    if (name) {
      name = name.toLowerCase().trim();
      fullName = name.split(" ");
      hasName = true;
    }

    // validate sort by
    if (!sort || (sort != "byName" && sort !== "byAmount")) {
      sort = "byName";
    }

    // validate month/year
    let sDate = new Date().setUTCFullYear(year, month, 1);
    sDate = new Date(new Date(sDate).setUTCHours(0, 0, 0, 0));
    let eDate = new Date().setUTCFullYear(year, month + 1, 0);
    eDate = new Date(new Date(eDate).setUTCHours(23, 59, 59, 999));

    // fetch users
    if (hasName === false) {
      fetchedUsers = await User.find()
        .select("_id first_name last_name email cpf_no")
        .sort({ fist_name: "desc" });
    } else {
      fetchedUsers = await User.find({
        $and: [
          { first_name: { $regex: new RegExp(fullName[0], "gi") } },
          { last_name: { $regex: new RegExp(fullName[1], "gi") } },
        ],
      })
        .select("_id first_name last_name email cpf_no")
        .sort({ fist_name: "desc" });
    }

    // fetch bookings
    let fetchedBookings = [];
    await Promise.all(
      fetchedUsers.map(async (usr) => {
        let total = 0;
        let lastDate = sDate;
        let result = await Booking.find({
          user_id: usr._id,
          booking_type: "normal",
          booking_date: {
            $gte: sDate,
            $lte: eDate,
          },
        })
          .select("_id booking_date price_at_booking _isCancelled")
          .populate({
            path: "user_id",
            select: "first_name last_name email cpf_no",
          })
          .populate({ path: "room_id", select: "name price" })
          .exec();
        result.forEach((b) => {
          total += b.price_at_booking;
          if (b.booking_date > lastDate) {
            lastDate = b.booking_date;
          }
        });
        if (result.length > 0) {
          fetchedBookings.push({
            user: usr,
            bookings: result,
            total: total,
            quantity: result.length,
            lastBookingDate: lastDate,
          });
        }
      })
    );

    if (sort == "byAmount") {
      fetchedBookings.sort((a, b) => {
        return b.total - a.total;
      });
    }

    res.send(fetchedBookings);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// --------------- GENERATE MONTHLY USER REPORTS ----------------- //
// to get the monthly report by User
router.get("/monthly_user", isLogged, isAuthenticated, async (req, res) => {
  try {
    let { name, year, month, sort, id } = req.query;

    // Validate incoming data
    year = parseInt(year);
    month = parseInt(month);
    let fullName = null;
    let hasName = false;
    let hasID = false;
    let fetchedUsers = [];

    // check if user id was provided
    if (id) {
      hasID = true;
    }

    // validate name
    if (name) {
      name = name.toLowerCase().trim();
      fullName = name.split(" ");
      hasName = true;
    }

    // validate sort by
    if (!sort || (sort != "asc" && sort !== "desc")) {
      sort = "asc";
    }

    // validate month/year
    let sDate = new Date().setUTCFullYear(year, month, 1);
    sDate = new Date(new Date(sDate).setUTCHours(0, 0, 0, 0));
    let eDate = new Date().setUTCFullYear(year, month + 1, 0);
    eDate = new Date(new Date(eDate).setUTCHours(23, 59, 59, 999));

    // fetch users
    if (hasID) {
      fetchedUsers = await User.findOne({ _id: id })
        .select("_id first_name last_name email cpf_no active")
        .sort({ fist_name: "desc" });
    } else {
      if (hasName === false) {
        fetchedUsers = await User.find()
          .select("_id first_name last_name email cpf_no active")
          .sort({ fist_name: "desc" });
      } else if (fullName.length > 1) {
        fetchedUsers = await User.find({
          $and: [
            { first_name: { $regex: new RegExp(`^${fullName[0]}`, "gi") } },
            { last_name: { $regex: new RegExp(`^${fullName[1]}`, "gi") } },
          ],
        })
          .select("_id first_name last_name email cpf_no active")
          .sort({ fist_name: "desc" });
      } else if (fullName.length === 1) {
        fetchedUsers = await User.find({
          first_name: { $regex: new RegExp(`^${fullName[0]}`, "gi") },
        })
          .select("_id first_name last_name email cpf_no active")
          .sort({ fist_name: "desc" });
      }
    }

    // returns an error message of "invalid user name"
    if (fetchedUsers.length === 0) {
      return res.send({ values: null, multiple: false, hasUser: false });
    }

    // returns a list of users to be selected
    // if user ID is present, this means it was already selected, so skip this
    if (fetchedUsers.length >= 1) {
      if (hasID === false) {
        return res.send({
          values: fetchedUsers,
          multiple: true,
          hasUser: true,
        });
      }
    }

    // fetch bookings
    let fetchedBookings = [];

    let total = 0;
    let lastDate = sDate;
    let result = await Booking.find({
      user_id: fetchedUsers._id,
      booking_type: "normal",
      booking_date: {
        $gte: sDate,
        $lte: eDate,
      },
    })
      .select("_id booking_date price_at_booking _isCancelled")
      .sort({ booking_date: sort })
      .populate({
        path: "user_id",
        select: "first_name last_name email cpf_no",
      })
      .populate({ path: "room_id", select: "name price" })
      .exec();
    result.forEach((b) => {
      total += b.price_at_booking;
      if (b.booking_date > lastDate) {
        lastDate = b.booking_date;
      }
    });
    //   if (result.length > 0) {
    fetchedBookings.push({
      user: fetchedUsers,
      bookings: result,
      total: total.toFixed(2),
      quantity: result.length,
      lastBookingDate: lastDate,
    });
    //  }

    if (sort == "byAmount") {
      fetchedBookings.sort((a, b) => {
        return b.total - a.total;
      });
    }

    res.send(fetchedBookings);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

// --------------- GENERATE USER REPORTS ----------------- //
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
