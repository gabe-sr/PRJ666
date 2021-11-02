import mongoose from "mongoose";
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    booking_date: {
        type: Date, //Date is supposed to be saved in UTC ISO format
        required: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId, // String, // Experimenting to see if its better to use this of String and then parse
        required: true
    },
    room_id: {
        type: mongoose.Schema.Types.ObjectId, // String,
        required: true
    },
    price_at_booking:{
        type: String,
        required: true
    },
    booking_type: {
        type: String,
        required: true,
        default: "normal"
    },
    cancel_request: {
        type: Boolean,
        default: false
    },
    _isCancelled: {
        type: Boolean,
        default: false
    }
}, {timestamps: true} );

const Booking = mongoose.model("booking", bookingSchema);

export { Booking }