// -------------------------------------------------------------------- //
// PSICOWORKING WEB APPLICATION
//
// Web server main file
//
// Authors: Gabriel Sola Rocha, Guilherme Licht Silva, Marcelle Polla
// Version: 0.1
// Date: 09/19/2021
// -------------------------------------------------------------------- //

// require mongoose and setup the Schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const express = require("express");
const app = express();



// to load all environment variables from .env file
require("dotenv").config();

// TESTING ROUTE
/* delete after implementing home page route */
app.get("/", (req, res) => {
  res.send(" PSICOWORKING -  HOMEPAGE");
});

//----------- DATABASE CONNECTION ----------//
const dbUrl = process.env.DB_URL;  // string with database URL
mongoose.connect(dbUrl, {useUnifiedTopology: true, useNewUrlParser: true})
    .then(() => {console.log(`MongoDB connection was sucessfully established.`)})
    .catch(err => {console.log(`MongoDB connection failed: ${err}`)
});


// Set server to listen at specific port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Psicoworking server is listening at http://localhost:${port}`);
});




