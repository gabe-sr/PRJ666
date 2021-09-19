// -------------------------------------------------------------------- //
// PSICOWORKING WEB APPLICATION
//
// Web server main file
//
// Authors: Gabriel Sola Rocha, Guilherme Licht Silva, Marcelle Polla
// Version: 0.1
// Date: 09/19/2021
// -------------------------------------------------------------------- //

const express = require("express");
const app = express();

// to load all environment variables from .env file
require("dotenv").config();

// TESTING ROUTE
/* delete after implementing home page route */
app.get("/", (req, res) => {
  res.send(" PSICOWORKING -  HOMEPAGE");
});

// Set server to listen at specific port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Psicoworking server is listening at http://localhost:${port}`);
});
