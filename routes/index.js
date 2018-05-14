var express = require("express");
var router = express.Router();
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

const knex = require("../db/knex");

/* GET home page. */
router.get("/", admin(), function(req, res, next) {
  res.render("index", { title: "Express" });
});

// Admin Login Page
router.get("/adminLogin", function(req, res, next) {
  res.render("adminLogin");
});

// Manager Login Page
router.get("/managerLogin", function(req, res, next) {
  res.render("managerLogin");
});

/* ************ POST ROUTES ************ */
// Admin Login
router.post(
  "/adminLogin",
  passport.authenticate("local.one", {
    successRedirect: "/",
    failureRedirect: "/adminLogin"
  }),
  (req, res) => {
    res.redirect("/");
  }
);

// Manager Login
router.post(
  "/managerLogin",
  passport.authenticate("local.two", {
    //successRedirect: `/managers/${req.session.passport.userId}`,
    failureRedirect: "/managerLogin"
  }),
  (req, res) => {
    res.redirect(`/managers/${req.session.passport.user.id}`);
  }
);

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/adminLogin");
});

passport.use(
  "local.one",
  new LocalStrategy((username, password, done) => {
    // Admin Lookup
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
        done(null, { id: admin.id, isAdmin: true });
        console.log("Looking up for an admin");
        console.log(JSON.stringify(admin, undefined, 2));
      });
  })
);

passport.use(
  "local.two",
  new LocalStrategy((username, password, done) => {
    // Manager Lookup
    knex("managers")
      .select()
      .where("email", username)
      .first()
      .then(manager => {
        if (!manager) {
          return done(null, false, { message: "Incorrect Username" });
        }
        if (manager.password !== password) {
          return done(null, false, { message: "Incorrect Password" });
        }
        console.log("Looking up for a manager");
        console.log(JSON.stringify(manager, undefined, 2));
        done(null, { id: manager.id, isAdmin: false });
      });
  })
);

passport.serializeUser((user, done) => {
  console.log("Serialize girdik");
  done(null, user);
});

passport.deserializeUser((user, done) => {
  console.log("Deserialize girdik");
  if (user.isAdmin === true) {
    knex("admins")
      .select()
      .where("id", user.id)
      .first()
      .then(user => {
        if (user) {
          return done(null, user);
        }
      });
  } else {
    console.log(JSON.stringify(user, undefined, 2));
    knex("managers")
      .select()
      .where("id", user.id)
      .first()
      .then(res => {
        if (res) {
          return done(null, res);
        }
      });
  }
});

function admin() {
  return (req, res, next) => {
    console.log(
      `req.session.passport.user: ${JSON.stringify(
        req.session.passport,
        undefined,
        2
      )}`
    );
    if (req.isAuthenticated()) {
      if (req.session.passport.user.isAdmin) {
        return next();
      }
    }
    res.redirect("/adminLogin");
  };
}
module.exports = router;
