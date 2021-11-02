import express from "express";
import { Booking } from "../models/bookingModel.js";
import { isAuthenticated } from "../middleware/auth.js"; // authentication middlewares
const router = express.Router({mergeParams:true});
 
//  Get bookings
//  gets all is no query is present
//  Gets on a specific date if query is present
router.get("/", async (req, res) => {
 try {
   if(!/\?.+/.test(req.url)){
     console.log(req)
     const bkns = await Booking.find().sort({ createdAt: "desc" });
     res.send(bkns);
     //testing logs - delete on final product
     console.log("bookingget")
   }else if(req.query.begin != null){
     const bkns = await Booking.find({ booking_date: { $gte: req.query.begin, $lt: req.query.end } }).sort({booking_date: "asc"})
     //testing logs - delete on final product
     console.log(req.query.begin)
     console.log(req.query.end)
     console.log("bookinggetperdate")
     console.log(bkns)
     res.send(bkns)
   }
  
 } catch (err) {
   console.log(err);
 }
});
 
//Get bookings by id
router.get("/:id", async (req, res) => {
 try {
   const bkns = await Booking.findById(req.params.id);
   res.send(user);
 } catch (err) {
   console.log(err);
 }
});
 
//Post booking to db (no auth)
router.post("/test/", async (req, res) => {
 let booking = new Booking({ ...req.body }); //deconstruct request to booking
 //check if booking already exists, inform user (see users.js POST method good practice)
 try {
  //  const exists = await Booking.findOne({ booking_date: booking.booking_date })
   const exists = await Booking.findOne({ booking_date: booking.booking_date, _isCancelled: false })
 
   if(exists){
     res.send({  message: "Booking already exists in db. Not possible to book on the same date and time ",
                   type:"alreadyExists"  }) 
   }else{
     booking = await booking.save();//validations should be exec in the backend, frontend or both?
     console.log(booking)
     res.send({  message: "Booking saved in db.",
                   type:"Success"  })
   }
 } catch (err) {
   res.send(err)
   console.log(err);
 }
});

//Post booking to db
router.post("/", isAuthenticated, async (req, res) => {
  let booking = new Booking({ ...req.body }); //deconstruct request to booking
  //check if booking already exists, inform user (see users.js POST method good practice)
  try {
   //  const exists = await Booking.findOne({ booking_date: booking.booking_date })
    const exists = await Booking.findOne({ booking_date: booking.booking_date, _isCancelled: false })
  
    if(exists){
      res.send({  message: "Booking already exists in db. Not possible to book on the same date and time ",
                    type:"alreadyExists"  }) 
    }else{
      booking = await booking.save();//validations should be exec in the backend, frontend or both?
      console.log(booking)
      res.send({  message: "Booking saved in db.",
                    type:"Success"  })
    }
  } catch (err) {
    res.send(err)
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
 
 