import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import mongoose from "mongoose";
import routes from "./routes.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT;
const DB_URL = process.env.DB_CONNECTION_STRING + "/" + process.env.DB_NAME;
const COOKIE_IN_DAYS = 1;

// set up express application
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // serve js/css files
app.set("view engine", "ejs");

// create a session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "topsecret",
    // https://github.com/expressjs/session?tab=readme-ov-file#resave
    resave: false,
    // https://github.com/expressjs/session?tab=readme-ov-file#saveuninitialized
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * (COOKIE_IN_DAYS * 24),
      httpOnly: true,
    },
  })
);

// connect to DB and start server
mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("Connected to db");

    const db = mongoose.connection.db;

    // initialize routes
    routes(app, db);

    // start server
    app.listen(PORT, () => {
      console.log(`Listening at localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
