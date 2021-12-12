// -------------------------------------------------------------------- //
// PSICOWORKING WEB APPLICATION
//
// Web server main file
//
// Authors: Gabriel Sola Rocha, Guilherme Licht Silva, Marcelle Polla
// Version: 0.1
// Date: 09/19/2021
// -------------------------------------------------------------------- //

// Imports
import mongoose from "mongoose";
import cors from "cors";
import express from "express";
import { router as userRouter } from "./routes/users.js";
import { router as roomRouter } from "./routes/rooms.js";
import { router as bookingRouter } from "./routes/bookings.js";
import { router as authRouter } from "./routes/authentication.js";
import { router as reportRouter } from "./routes/reports.js";
import session from "express-session";
import { sessionConfig } from "./middleware/sessionConfig.js"; // configuration for session middleware
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Create express app
const app = express();

// Directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// enable CORS requests
//app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cors());

//correctly construct url 
app.use(express.static(path.join(__dirname, "build")));

// Used to parse JSON bodies
app.use(express.json());

// Use express to parse incoming requests,
app.use(express.urlencoded({ extended: false }));

// to load all environment variables from .env file
import {} from "dotenv/config";

// Session middleware
app.use(session(sessionConfig));

// Set the router middleware for the user side, only requests to /users/* will be sent to userRouter
app.use("/users", userRouter);
app.use("/rooms", roomRouter);
app.use("/book", bookingRouter);
app.use("/authentication", authRouter);
app.use("/reports", reportRouter);

// Serve path to frontend 
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//----------- DATABASE CONNECTION ----------//
const dbUrl = process.env.DB_URL; // string with database URL
mongoose
  .connect(dbUrl, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log(`MongoDB connection was sucessfully established.`);
  })
  .catch((err) => {
    console.log(`MongoDB connection failed: ${err}`);
  });

// Set server to listen at specific port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Psicoworking server is listening at http://localhost:${port}`);
});
