const cors = require("cors");
const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 3000;
const app = express();

// Import routers

// Import controllers

// Import db
const db = require("./db/models/index");
const { user } = db;

// Initialise controllers

// Initialise routers

// Enable CORS
app.use(cors());

// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routers
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
