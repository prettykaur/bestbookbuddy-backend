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
const BooksRouter = require("./routers/booksRouter");
const FriendsRouter = require("./routers/friendsRouter");

// Import controllers
const UsersController = require("./controllers/usersController");
const BooksController = require("./controllers/booksController");
const FriendsController = require("./controllers/friendsController");

// Import db
const db = require("./db/models/index");
const { user, book, friend, friendrequest, friendrequeststatus } = db;

// Initialise controllers
const usersController = new UsersController(user);
const booksController = new BooksController(book);
const friendsController = new FriendsController(
  friend,
  friendrequest,
  friendrequeststatus
);

// Initialise routers
const usersRouter = new UsersRouter(usersController, checkJwt).routes();
const booksRouter = new BooksRouter(booksController, checkJwt).routes();
const friendsRouter = new FriendsRouter(friendsController, checkJwt).routes();

// Enable CORS
app.use(cors());

// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routers
app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/friends", friendsRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
