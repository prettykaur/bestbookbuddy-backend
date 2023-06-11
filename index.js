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
const LibraryRouter = require("./routers/libraryRouter");
const ReviewsRouter = require("./routers/reviewsRouter");
const CollectionsRouter = require("./routers/collectionsRouter");
const DiscussionsRouter = require("./routers/discussionsRouter");
const ActivitiesRouter = require("./routers/activitiesRouter");

// Import controllers
const UsersController = require("./controllers/usersController");
const BooksController = require("./controllers/booksController");
const FriendsController = require("./controllers/friendsController");
const LibraryController = require("./controllers/libraryController");
const ReviewsController = require("./controllers/reviewsController");
const CollectionsController = require("./controllers/collectionsController");
const DiscussionsController = require("./controllers/discussionsController");
const ActivitiesController = require("./controllers/activitiesController");

// Import db
const db = require("./db/models/index");
const {
  user,
  book,
  friendrequest,
  friendrequeststatus,
  userbook,
  readingstatus,
  bookreview,
  collection,
  discussion,
  activity,
} = db;

// Initialise controllers
const usersController = new UsersController(user);
const booksController = new BooksController(book);
const activitiesController = new ActivitiesController(
  activity,
  user,
  book,
  bookreview,
  userbook,
  collection,
  discussion
);
const friendsController = new FriendsController(
  user,
  friendrequest,
  friendrequeststatus,
  activity
);
const libraryController = new LibraryController(
  userbook,
  book,
  readingstatus,
  user,
  activity
);
const reviewsController = new ReviewsController(
  bookreview,
  book,
  user,
  activity
);
const collectionsController = new CollectionsController(
  collection,
  book,
  user,
  activity
);
const discussionsController = new DiscussionsController(
  discussion,
  book,
  user,
  activity
);

// Initialise routers
const usersRouter = new UsersRouter(usersController, checkJwt).routes();
const booksRouter = new BooksRouter(booksController, checkJwt).routes();
const activitiesRouter = new ActivitiesRouter(
  activitiesController,
  checkJwt
).routes();
const friendsRouter = new FriendsRouter(friendsController, checkJwt).routes();
const libraryRouter = new LibraryRouter(libraryController, checkJwt).routes();
const reviewsRouter = new ReviewsRouter(reviewsController, checkJwt).routes();
const collectionsRouter = new CollectionsRouter(
  collectionsController,
  checkJwt
).routes();
const discussionsRouter = new DiscussionsRouter(
  discussionsController,
  checkJwt
).routes();

// Enable CORS
app.use(cors());

// Setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use routers
app.use((req, res, next) => {
  console.log(req.headers.authorization); // Print the Authorization header
  next();
});

app.use("/users", usersRouter);
app.use("/books", booksRouter);
app.use("/feed", activitiesRouter);
app.use("/friends", friendsRouter);
app.use("/library", libraryRouter);
app.use("/reviews", reviewsRouter);
app.use("/collections", collectionsRouter);
app.use("/discussions", discussionsRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
