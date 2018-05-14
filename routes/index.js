var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

const knex = require("../db/knex");

/* GET home page. */
router.get("/", adminAuthenticationMiddleware(), function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/adminLogin", function(req, res, next) {
  res.render("adminLogin");
});

/* ************ POST ROUTES ************ */
// Admin Login
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

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/adminLogin");
});

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
        return done(null, { id: admin.id, isAdmin: true });
      });
  })
);

passport.serializeUser((admin, done) => {
  console.log("Serialize girdik");
  done(null, admin);
});

passport.deserializeUser((admin, done) => {
  console.log("Deserialize girdik");
  knex("admins")
    .select()
    .where("id", admin.id)
    .first()
    .then(admin => {
      done(null, admin);
    });
});

function adminAuthenticationMiddleware() {
  return (req, res, next) => {
    console.log(
      `req.session.passport.user: ${JSON.stringify(
        req.session.passport,
        undefined,
        2
      )}`
    );
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/adminLogin");
  };
}
module.exports = router;
