if ((process.env.NODE_ENV = "development")) {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const Users = require("./models/model");

const { PORT, MONGODB_USER, MONGODB_PASS, MONGODB_DB } = process.env;

const URI = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.xuroh.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority`;
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.once("open", () => console.log("connected to the database"));
db.on("error", console.error.bind(console, "MongoDB connection error:"));

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
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.get("/", (req, res) => {
  res.send(`
    <a href='/login'>To Login Page</a><br>
    <a href='/register'>To Register Page</a>
  `);
});

app.get("/register", (req, res) => {
  res.send(`
    <form action='/register' method='POST'>
      <input name='name' value='alex'/>
      <input name='email' value='a@a'/>
      <input name='password' value='a'/>
      <input type='submit' value='Register'/>
    </form>
  `);
});

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);
  const user = new Users({
    name,
    email,
    password,
  });
  user
    .save()
    .then((result) => {
      console.log(result);
      res.send(
        `Name: ${JSON.stringify(user.name)}\nEmail: ${JSON.stringify(
          user.email
        )}\nPassword: ${JSON.stringify(user.password)}`
      );
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Register request failed");
    });
});

app.get("/login", (req, res) => {
  console.log(`get.("/login") - ${req.session.userId}`);
  res.send(
    `
        <form action='/login' method='POST'>
            <input name='email' value='s@s'/>
            <input name='password' value='s'/>
            <input type='submit' value='Login'/>
        </form>
    `
  );
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  Users.findOne({ email, password })
    .exec()
    .then((user) => {
      //   console.log(user);
      console.log(`.post("/login") - ${user._id}\n`);
      req.session.userId = user._id;
      //   res.send(
      //     `Name: ${JSON.stringify(user.name)}\nEmail: ${JSON.stringify(
      //       user.email
      //     )}`
      //   );
      req.session.save(res.redirect("/dashboard"));
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send();
    });
});

app.get("/logout", (req, res) => {
  console.log(`get.("/logout") - ${req.session.userId}`);
  req.session.destroy();
  return res.redirect("/");
});

app.get("/dashboard", (req, res) => {
  if (!req.session.userId) {
    return res.status(401).send("No user ID");
  }
  console.log(
    `Dashboard now - ${req.session.userId}\nSession - ${JSON.stringify(
      req.session
    )}`
  );
  return res.send(`
  Congratulations! You are logged in.
    <a href="/logout">Logout</a>
  `);
  // return res.status(200).send("Welcome to the super-secret API");
});

app.listen(PORT, () => {
  console.log(`listening at http://localhost:${PORT}`);
});
