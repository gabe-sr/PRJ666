// Configuration of session with mongoDB storage
import MongoStore from "connect-mongo";
import {} from "dotenv/config";

const expTime = 1000 * 60 * 60; //1 hour

export const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  saveUninitialized: true,
  cookie: { maxAge: expTime },
  resave: false,
  store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
};
