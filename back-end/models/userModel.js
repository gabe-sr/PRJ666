import mongoose from "mongoose"; // ODM library for MonogoDB and NodeJS
const Schema = mongoose.Schema; // used to create Schema objects

// Some properties are commented for testing
const userSchema = new Schema({
  active: {
    type: Boolean,
    default: false,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  crp_no: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  dob: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  cpf_no: {
    type: String,
    default: "",
  },
  methodology: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("user_registration", userSchema); // creates a DOCUMENT (instance of a model)

export { User };
