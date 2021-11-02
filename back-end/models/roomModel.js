import mongoose from "mongoose";
import marked from "marked";
import slugify from "slugify";
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});

roomSchema.pre("validate", function (next) {
  if (this.name) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  next();
});

const Room = mongoose.model("room", roomSchema);

export { Room };
