import express from "express";
import { Booking } from "../models/bookingModel.js";
import { isLogged, isAuthenticated } from "../middleware/auth.js"; // authentication middlewares
import { format } from "date-fns";
import { transporter, mailCancelNotice, mailConfirmNotice } from "../email-notification/email.js";
import sendGridMail from "../node_modules/@sendgrid/mail/index.js";
import {} from "dotenv/config";
sendGridMail.setApiKey(process.env.SENDGRID_API_KEY);
const router = express.Router({ mergeParams: true });

 /*Get bookings
    Gets all is no query is present
    Gets on a specific date if query is present*/
router.get("/", async (req, res) => {
  try {
    if (!/\?.+/.test(req.url)) {
      console.log(req);
      const bkns = await Booking.find().sort({ createdAt: "desc" });
      res.send(bkns);
      //testing logs - delete on final product
      // console.log("get booking on range:");
    } else if (req.query.type == 'general') {
      const bkns = await Booking.find({
        booking_date: { $gte: req.query.begin, $lt: req.query.end },
      })
        .sort({ booking_date: "asc" })
        .where({ room_id: req.query.roomid, _isCancelled: false });
      //testing logs - delete on final product
      // console.log(req.query.begin);
      // console.log(req.query.end);
      res.send(bkns);
    }else if(req.query.type == 'aftbkns'){
      // console.log(`query date: ${req.query.date}`)
      const bkns = await Booking.find({
        booking_date: { $gte: req.query.date}
      })
        .populate({
          path: "room_id",
          select: "name"
        })
        .sort({ booking_date: "asc" })
        .where({ user_id: req.query.userid });
      res.send(bkns);
    }else if(req.query.type == 'bfrbkns'){
      // console.log(`query date: ${req.query.date}`)
      const bkns = await Booking.find({
        booking_date: { $lt: req.query.date}
      })
        .populate({
          path: "room_id",
          select: "name"
        })
        .sort({ booking_date: "desc" })
        .where({ user_id: req.query.userid });
      res.send(bkns);
    }else if(req.query.type == 'aftrequest'){
      const bkns = await Booking.find({
        booking_date: { $gte: req.query.date}
      })
        .populate({
          path: "user_id",
          select: "first_name last_name"
        })
        .populate({
          path: "room_id",
          select: "name"
        })
        .sort({ booking_date: "asc" })
        .where({ $or: [{cancel_request:true}, {_isCancelled:true}] });
      res.send(bkns);
    }else if(req.query.type == 'bfrequest'){
      const bkns = await Booking.find({
        booking_date: { $lt: req.query.date}
      })
        .populate({
          path: "user_id",
          select: "first_name last_name"
        })
        .populate({
          path: "room_id",
          select: "name"
        })
        .sort({ booking_date: "desc" })
        .where({ $or: [{cancel_request:true}, {_isCancelled:true}] });
      res.send(bkns);
    }
  } catch (err) {
    console.log(err);
  }
});

//Get bookings by id
router.get("/:id", async (req, res) => {
  try {
    const bkns = await Booking.findById(req.params.id);
    res.send(bkns);
  } catch (err) {
    console.log(err);
  }
});

//Post booking to db (no auth)
router.post("/test/", async (req, res) => {
  let booking = new Booking({ ...req.body }); //deconstruct request to booking
  //check if booking already exists, inform user (see users.js POST method good practice)
  try {
    const exists = await Booking.findOne({
      booking_date: booking.booking_date,
      _isCancelled: false,
      room_id: booking.roomid,
    });

    if (exists) {
      res.send({
        message:
          "Booking already exists in db. Not possible to book on the same date and time ",
        type: "alreadyExists",
      });
    } else {
      booking = await booking.save();
      console.log(booking);
      res.send({ message: "Booking saved in db.", type: "Success" });
    }
  } catch (err) {
    res.send(err);
    console.log(err);
  }
});

//Post booking to db .//isLogged, isAuthenticated,
router.post("/", isLogged, isAuthenticated, async (req, res) => {
  let booking = new Booking({ ...req.body }); //deconstruct request to booking
  //check if booking already exists, inform user (see users.js POST method good practice)
  const response = {
    title:    [],
    message:  ``,
    success:  false,
    error:    null,
    booking:  {}
  }

  console.log("POST:")
  try {
    const recordUser = await Booking.find({booking_date: booking.booking_date, user_id: booking.user_id, _isCancelled: false});
    const recordRoom = await Booking.find({booking_date: booking.booking_date, room_id: booking.room_id, _isCancelled: false});
    if(recordUser.length > 0){
      throw new Error(`Another booking for you found at the same date and time`);
      // response.message.push(`Another booking for you found at the same date and time`);
    }
    if(recordRoom.length > 0){
      throw new Error(`Another booking for found at the same date and time for this room`);
      // response.message.push(`Another booking for found at the same date and time for this room`);
    }
    // if(response.message.length == 0){
    //   booking = await booking.save();
    //   console.log("this was also executed")
    //   response.message.push("Booking saved in db.");
    //   response.success = true;
    // }
    booking = await booking.save();
    const cnfrm = await Booking.findById(booking._id)
      .populate({
        path: "user_id",
        select: "first_name last_name email"
      })
      .populate({
        path: "room_id",
        select: "name"
      })
      .exec();
      
      //ResponseError: Forbidden
      // at node_modules/@sendgrid/client/src/classes/client.js:146:29
      await sendGridMail.send(
        mailConfirmNotice(
          `${cnfrm.user_id.first_name} ${cnfrm.user_id.last_name}`,
          cnfrm.user_id.email,
          cnfrm.room_id.name,
          format(cnfrm.booking_date, "iii '-' do 'of' MMMM', ' yyyy ' at ' H ' : ' mm"))
      )
                        .then((res)=>{
                          console.log(res[0].statusCode)
                          console.log(res[0].headers)
                        })
                        .catch((err)=>{
                          console.log(err)
                        })
    // transporter.sendMail(
    //   mailConfirmNotice(
    //     `${cnfrm.user_id.first_name} ${cnfrm.user_id.last_name}`,
    //     cnfrm.user_id.email,
    //     cnfrm.room_id.name,
    //     cnfrm.booking_date),
    //     (error, info) =>{
    //       if(error){
    //         return console.log(error)
    //       }
    //       console.log(`Message sent: ${info.messageId}`)
    //     }
    //   );
    // console.log("this was also executed")
    response.title = "Booking saved in db.";
    response.message = `${format(booking.booking_date, "iii '-' do 'of' MMMM', ' yyyy")}`
    response.success = true;
    response.booking = booking.booking_date;
    console.log(response.message)
    res.send(response);
  } catch (err) {
    console.log(err)
    response.title = "Something went wrong..."
    response.message = err.message
    response.error = err
    res.send(response);
  }
});

//Post maintenance booking to db .//isLogged, isAuthenticated, add isAdmin 
router.post("/maintenance", isLogged, isAuthenticated, async (req, res) => {
  let bookings = req.body.booking_dates.map(
    bk => 
      new Booking(
        {
          booking_date:     bk, 
          booking_type:     req.body.booking_type,
          user_id:          req.body.user_id,
          room_id:          req.body.room_id,
          price_at_booking: req.body.price_at_booking
        })
  );
  // let bookings = new Booking({ ...req.body }); //deconstruct request to booking
  //check if booking already exists, inform user (see users.js POST method good practice)
  const response = {
    title:    [],
    message:  ``,
    success:  false,
    error:    null,
    booking:  {}
  }
  console.log("MAINTENANCE")
  // console.log(bookings)
  try {
    //check if there are bookings for that date in that room that are not cancelled
    const records = await Booking.find(
      {
        booking_date: {$in: req.body.booking_dates},
        room_id: req.body.room_id,
        _isCancelled: false
      })
      .populate({
        path: "user_id",
        select: "first_name last_name email"
      })
      .populate({
        path: "room_id",
        select: "name"
      })
      .exec();
      console.log(`found records:`)
      console.log(records)
    if(records.length > 0){
      console.log(`records found`)
      // cancel records in db, that have the same timestamps as the maintenance
      // booking_date: {$in: req.body.booking_dates},
      // room_id: req.body.room_id
      // ***was using timestamps and room_id to update/cancel bookings in db, but 
      // it is prone to update other records if not using a unique field, so it was 
      // substituted by an array of ids
      const cancelled = await Booking.updateMany(
        {
          _id: {$in: records.map(r=>r._id)}
        },
        {_isCancelled: true}
      )

      // since every message is different, cant use send multiple, etc... 
      // check out personalizations to see if possible to use sendMultiple
      if(cancelled.acknowledged){
        console.log(`acknowledged: ${cancelled.acknowledged}`)
        await Promise.all(records.map((r)=>{
          sendGridMail.send(
            mailCancelNotice(
              `${r.user_id.first_name} ${r.user_id.last_name}`,
              r.user_id.email,
              r.room_id.name,
              format(r.booking_date, "iii '-' do 'of' MMMM', ' yyyy ' at ' H ' : ' mm"),
              `Maintenance needed for ${r.room_id.name}`)
          )
                      .then((res)=>{
                        console.log(res[0].statusCode)
                        console.log(res[0].headers)
                      })
                      .catch((err)=>{
                        console.log(err)
                      })
        }))
      }
      
      // update multiple logs
      console.log(`Number of documents upserted (should be 0 always):`)
      console.log(cancelled.upsertedCount)
      console.log(`update status ${cancelled.acknowledged}`)
      console.log(`Number of documents matched (should be equal the numbr of records found):`)
      console.log(cancelled.matchedCount)
      console.log(`Number of documents modified (should be equal the matched number):`)
      console.log(cancelled.modifiedCount)
    }
    // Save maintenance bookings
    bookings = await Booking.bulkSave(bookings);
    response.title = "Maintenance bookings saved in db.";
    response.message =`Maintenance booked`
    response.success = true;
    
    response.booking = bookings.booking_date;
    res.send(response);
  } catch (err) {
    console.log(err)
    response.title = "Something went wrong..."
    response.error = err;
    res.send(response);
    // console.log(err);
  }
});

//update cancellation request
router.patch("/cancel_request/:id", async (req,res)=>{
  const response = {
    title:    [],
    message:  ``,
    success:  false,
    error:    null,
    booking:  {}
  }
  console.log(req.body)
  try {
    const bkns = await Booking.findByIdAndUpdate(
      { _id: req.params.id },
      { cancel_request: req.body.cancel_request},
      { new: true });

    response.success = bkns.cancel_request
    response.booking = bkns.booking_date
    if(bkns.cancel_request){
      response.title = `Cancel request sent`
      response.message = `Cancel request for booking on date ${format(bkns.booking_date, "iii '-' do 'of' MMMM', ' yyyy")} at ${bkns.booking_date.getUTCHours()}
      has been set. Please wait for processing.`
    }else{
      response.title = `Cancel request was not sent`
      response.message = `Something went wrong, this booking was not found.`
    }

    // response.message = (bkns.cancel_request ? 
    //   `Cancel request for booking on date ${format(bkns.booking_date, "iii '-' do 'of' MMMM', ' yyyy")} at ${bkns.booking_date.getUTCHours()}
    //    has been set. Please wait for processing.`
    //   :
    //   `Something went wrong, this booking was not found. Cancel request was not updated.`)
    
    // console.log(response)
    // Send cancellation request email notice
    
    res.send(response)
    
  } catch (err) {
    response.message = `Something went wrong:`
    response.error = err
    res.send(response)
  }
})

router.patch("/cancel_approve/:id", async (req,res)=>{
  const response = {
    title:    [],
    message:  ``,
    success:  false,
    error:    null,
    booking:  {}
  }
  console.log(`PATCH (approve cancel):`)
  try {
    const bkns = await Booking.findByIdAndUpdate(
      { _id: req.params.id },
      { _isCancelled: req.body._isCancelled},
      { new: true })
      .populate({
        path: "user_id", 
        select: "first_name last_name email"})
      .populate({
        path: "room_id",
        select: "name"})
      .exec();
    response.success = bkns._isCancelled
    response.booking = bkns.booking_date
    if(bkns._isCancelled){
      response.title = `Booking Cancelled`
      response.message = `Booking on date ${format(bkns.booking_date, "iii '-' do 'of' MMMM', ' yyyy")} at ${bkns.booking_date.getUTCHours()}
                          has been successfully cancelled`
    }else{
      response.title = `Cancel request was not updated`
      response.message = `Something went wrong, this booking was not found. Booking was not cancelled.`
    }
    // response.message = (bkns._isCancelled ? 
    //   `Booking on date ${format(bkns.booking_date, "iii '-' do 'of' MMMM', ' yyyy")} at ${bkns.booking_date.getUTCHours()}
    //    has been successfully cancelled`
    //   :
    //   `Something went wrong, this booking was not found. Cancel request was not updated.`)
    

    console.log(format(bkns.booking_date, "iii '-' do 'of' MMMM',' yyyy '- cancelled'"))
    
    // Send cancellation email notification
    sendGridMail.send(
      mailCancelNotice(
        `${bkns.user_id.first_name} ${bkns.user_id.last_name}`,
        bkns.user_id.email,
        bkns.room_id.name,
        format(bkns.booking_date, "iii '-' do 'of' MMMM', ' yyyy ' at ' H ' : ' mm"),
        `Cancellation request was approved.`)
    )    
                .then((res)=>{
                  console.log(res[0].statusCode)
                  console.log(res[0].headers)
                })
                .catch((err)=>{
                  console.log(err)
                })
    res.send(response)
    
  } catch (err) {
    console.log(err)
    response.title = `Something went wrong:`
    response.error = err
    response.success = false
    res.send(response)
  }
})

//~~DANGER~~
//wipe out whole collection
router.delete("/deleteAll", async (req, res) => {
  try {
    //deleteMany with nothing as query params, should delete every single record
    const deleted = await Booking.deleteMany({});
    //print the number of deleted records
    console.log(deleted)
    res.send(deleted)
  } catch (err) {
    console.log(err);
  }
});

//Delete booking on db, we still need to decide wether we are actually deleting bookings, or just flagging as deleted
// router.delete("/:id", async (req, res) => {
//   try {
//     //
//     await Booking.findByIdAndDelete(req.params.id);
//   } catch (err) {
//     console.log(err);
//   }
// });

export { router };
