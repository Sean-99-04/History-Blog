let checkState = new Promise((resolve, reject) => {
  if (process.env.NODE_ENV !== "production") {
    resolve(require("dotenv").config());
  } else {
    reject("Could not load dotenv");
  }
});
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const routes = require("./routes/routes");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const methodOverride = require("method-override");

const { PORT, MONGODB_URI, NODE_ENV } = process.env;

checkState
  .then((resolved) => {
    // MONGODB
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    const db = mongoose.connection;
    db.once("open", () => console.log("connected to the database"));
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
  })
  .catch((rejected) => {
    console.log("There was an error: " + rejected);
  });

// HANDLEBARS
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "random-secret",
    resave: false,
    saveUninitialized: true,
    name: "sid",
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24,
      secret: "mongo-secret",
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 2 },
  })
);
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use("/", routes);

app.listen(PORT || 3000, () => {
  console.log("listening at http://localhost:3000");
});
