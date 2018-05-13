var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

const knex = require("../db/knex");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/adminLogin", function(req, res, next) {
  res.render("adminLogin");
});

/* ************ POST ROUTES ************ */
router.post(
  "/adminLogin",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/adminLogin"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

passport.use(
  new LocalStrategy((username, password, done) => {
    knex("admins")
      .select()
      .where("email", username)
      .first()
      .then(admin => {
        if (!admin) {
          return done(null, false, { message: "Incorrect Username" });
        }
        if (admin.password !== password) {
          return done(null, false, { message: "Incorrect Password" });
        }
        return done(null, admin);
      });
  })
);

passport.serializeUser((admin, done) => {
  console.log("Serialize girdik");
  done(null, admin.id);
});

passport.deserializeUser((id, done) => {
  console.log("Deserialize girdik");
  knex("admins")
    .select()
    .where("id", id)
    .first()
    .then(admin => {
      done(null, admin.id);
    });
});
module.exports = router;
