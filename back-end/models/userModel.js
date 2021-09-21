import mongoose from 'mongoose'; // ODM library for MonogoDB and NodeJS 
const Schema = mongoose.Schema;  // used to create Schema objects

const userSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    active: {
        type: Boolean,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    loginStatus: {
        type: Boolean,
        required: true
    },
    crp_no: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now()
    },    
    cpf_no: {
        type: String,
        required: true,
        unique: true
    },
    methodology: {
        type: String,
        required: true
    }
});

const User = mongoose.model("user_registration", userSchema); // creates a DOCUMENT (instance of a model)

export {User};