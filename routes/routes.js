if ((process.env.NODE_ENV = "development")) {
  require("dotenv").config();
}
const express = require("express");
const router = express.Router();
const Users = require("./../models/model");

router.use((req, res, next) => {
  res.locals.session = req.session;
  //   console.log(`res.locals - ${JSON.stringify(res.locals)}`);
  next();
});

const redirectUnloggedUser = (req, res, next) => {
  if (!req.session.userId) {
    console.log("You are not logged in");
    return res.redirect("/");
  } else if (req.session.userId) {
    console.log(
      `Logged in with user ID as: ${JSON.stringify(req.session.userId)}`
    );
  }
  next();
};

router.get("/", (req, res) => {
  let logged;
  if (!req.session.userId) {
    // console.log("NOT logged in");
    logged = false;
    return res.render("landing", { logged });
  } else if (req.session.userId) {
    // console.log(
    //   `Logged in with user ID as: ${JSON.stringify(req.session.userId)}`
    // );
    logged = true;
    return res.render("landing", { logged });
  }
});

router.post("/register", (req, res) => {
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

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  Users.findOne({ email, password })
    .exec()
    .then((user) => {
      //   console.log(user);
      console.log(`.post("/login") - ${user._id}\n`);
      req.session.userId = user._id;
      req.session.save(res.redirect("/dashboard"));
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send();
    });
});

router.post("/logout", (req, res) => {
  console.log(`get.("/logout") - ${req.session.userId}`);
  req.session.destroy();
  return res.redirect("/");
});

router.get("/dashboard", redirectUnloggedUser, (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send(`
        <h2>Error: error at get.("/dashboard")<h2>
        <br>
        <p>Could not find userId specified in req.session.userId</p>
    `);
  } else if (userId) {
    console.log(userId);
    Users.findOne({ _id: userId })
      .exec()
      .then((user) => {
        const newUser = {
          name: user.name,
          email: user.email,
        };
        return res.render("dashboard", { user: newUser });
      })
      .catch((err) => console.log(err));
  }
});

router.get("/*", (req, res) => {
  res.send(`
        <h2>404 Page does not exist</h2>
        <a href="/">Return Home</a>
    `);
});

module.exports = router;
