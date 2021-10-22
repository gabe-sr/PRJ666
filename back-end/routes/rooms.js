import express from "express";
import { Room } from "../models/roomModel.js";

const router = express.Router();

//Only one room will be fetched at a time for a web page

router.get("/:slug", async (req, res) => {
  try {
    const room = await Room.findOne({ slug: req.params.slug });
    // inform user if not fount etc...
    res.send(room);
  } catch (err) {
    console.log(err);
  }
});

export { router };
