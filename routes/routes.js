if ((process.env.NODE_ENV = "development")) {
  require("dotenv").config();
}
const express = require("express");
const router = express.Router();
const session = require("express-session");
const mongoose = require("mongoose");
const Users = require("./../models/model");

router.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

router.get("/", (req, res) => {
  res.send(`
      <a href='/login'>To Login Page</a><br>
      <a href='/register'>To Register Page</a>
    `);
});

router.get("/register", (req, res) => {
  res.send(`
      <form action='/register' method='POST'>
        <input name='name' value='alex'/>
        <input name='email' value='a@a'/>
        <input name='password' value='a'/>
        <input type='submit' value='Register'/>
      </form>
    `);
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

router.get("/login", (req, res) => {
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

router.post("/login", (req, res) => {
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

router.get("/logout", (req, res) => {
  console.log(`get.("/logout") - ${req.session.userId}`);
  req.session.destroy();
  return res.redirect("/");
});

router.get("/dashboard", (req, res) => {
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

module.exports = router;
