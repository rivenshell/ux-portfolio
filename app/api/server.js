// server set up
const express = require("express");
const app = express();
const port = 3000;

// Route handler for default homepage
app.get("/", (req, res) => {
  res.send("I have been actualized");
});

// Starts server
app.listen(port, () => {
  console.log("I am listening to your app's server requests");
});
