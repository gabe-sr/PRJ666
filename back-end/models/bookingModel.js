import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    booking_date: {
      type: Date, //Date is supposed to be saved in UTC ISO format
      required: true,
    },
    // user_id: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    // },
    // room_id: {
    //   type: mongoose.Schema.Types.ObjectId, 
    //   required: true,
    // }
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_registration",
    },
    room_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "room",
    }
    ,
    price_at_booking: {
      type: Number,
      required: true,
    },
    discount:{
      type: Object,
      default: {
        name: "noDiscount",
        value:0}
    },
    booking_type: {
      type: String,
      required: true,
      default: "normal",
    },
    cancel_request: {
      type: Boolean,
      default: false,
    },
    _isCancelled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("booking", bookingSchema);

export { Booking };
