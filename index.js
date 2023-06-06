const cors = require("cors");
const express = require("express");
require("dotenv").config();
const { auth } = require("express-oauth2-jwt-bearer");

const PORT = process.env.PORT || 3000;
const app = express();
const checkJwt = auth({
  audience: process.env.AUTH_AUDIENCE,
  issuerBaseURL: process.env.AUTH_DOMAIN,
});

// Import routers
const UsersRouter = require("./routers/usersRouter");

// Import controllers
const UsersController = require("./controllers/usersController");

// Import db
const db = require("./db/models/index");
const { user } = db;

// Initialise controllers
const usersController = new UsersController(user);

// Initialise routers
const usersRouter = new UsersRouter(usersController, checkJwt).routes();

// Enable CORS
app.use(cors());

// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routers
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
