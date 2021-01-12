if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const router = express.Router();
const Users = require("./../models/users");
const Article = require("./../models/article");
const formatDate = require("./../api/dateFormatting");

// LOGGING IN
router.use((req, res, next) => {
  res.locals.session = req.session;
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
  Article.find({})
    .exec()
    .then((oldArticleObj) => {
      const newArticleObj = {
        articles: oldArticleObj.map((data) => {
          return {
            _id: data._id,
            author: data.author,
            title: data.title,
            content: data.content,
            sources: data.sources,
            tags: data.tags,
            createdAt: formatDate(data.createdAt),
          };
        }),
      };
      // Login Verification
      console.log(req.session.userId);
      let logged;
      if (!req.session.userId) {
        logged = false;
        return res.render("landing", {
          logged,
          pageTitle: "Landing",
          articles: newArticleObj.articles,
        });
      } else if (req.session.userId) {
        logged = true;
        return res.render("landing", {
          logged,
          pageTitle: "Landing",
          articles: newArticleObj.articles,
        });
      }
    })
    .catch((err) => console.log(err));
});

// router.post("/register", (req, res) => {
//   const { name, email, password } = req.body;
//   console.log(name, email, password);
//   const user = new Users({
//     name,
//     email,
//     password,
//   });
//   user
//     .save()
//     .then((result) => {
//       console.log(result);
//       res.send(
//         `Name: ${JSON.stringify(user.name)}\nEmail: ${JSON.stringify(
//           user.email
//         )}\nPassword: ${JSON.stringify(user.password)}`
//       );
//     })
//     .catch((err) => {
//       console.log(err);
//       return res.status(500).send("Register request failed");
//     });
// });

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  Users.findOne({ email, password })
    .exec()
    .then((user) => {
      console.log(`.post("/login") - ${user._id}\n`);
      req.session.userId = user._id;
      req.session.save(res.redirect("/"));
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
// END OF LOGGING IN //

// ARTICLES
router.post("/addArticle", (req, res) => {
  const { author, title, content, sources, tags } = req.body;
  const article = new Article({
    author,
    title,
    content,
    sources,
    tags,
  });
  article
    .save()
    .then((savedArticle) => {
      console.log(savedArticle);
    })
    .catch((err) => console.log(err));
  return res.redirect("/");
});

router.get('/editArticle/:_id"', (req, res) => {
  return res.render("editArticle", {});
});

router.get("/editArticle/:_id", (req, res) => {
  Article.findOne({ _id: req.params._id })
    .exec()
    .then((article) => {
      const { _id, author, title, content, sources, tags, createdAt } = article;
      const newArticle = {
        _id,
        author,
        title,
        content,
        sources,
        tags,
        createdAt: formatDate(createdAt),
      };
      return res.render("editArticle", {
        article: newArticle,
        pageTitle: "Editing",
      });
    })
    .catch((err) => console.log(err));
});

router.patch("/editArticle/:_id", (req, res) => {
  const { author, title, content, sources, tags } = req.body;
  Article.findOneAndUpdate(
    {
      _id: req.params._id,
    },
    {
      author,
      title,
      content,
      sources,
      tags,
    },
    (err) => {
      if (err) console.log(err);
    }
  );
  console.log(`Updated article with id: ${req.params._id}`);
  return res.redirect("/");
});

router.delete("/deleteArticle/:_id", (req, res) => {
  Article.deleteOne({ _id: req.params._id }, (err) => {
    if (err) console.log(err);
  });
  return res.redirect("/");
});

// END OF ARTICLES //

// ANYTHING ELSE //
router.get("/*", (req, res) => {
  res.send(`
        <h2>404 Page does not exist</h2>
        <a href="/">Return Home</a>
    `);
});

module.exports = router;
