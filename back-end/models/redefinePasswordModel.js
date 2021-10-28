import mongoose from "mongoose";
const Schema = mongoose.Schema;

const redefineSchema = new Schema({
  createdAt: { type: Date, expires: 1200, default: Date.now },
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

const RedefinePassword = mongoose.model("redefine-credentials", redefineSchema);

export { RedefinePassword };
