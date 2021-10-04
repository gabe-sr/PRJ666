// Configuration of session with mongoDB storage
// sessions and cookies are stored in the database, under "sessions" collection
// lifetime = 1hour, after that they are deleted from DB
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
