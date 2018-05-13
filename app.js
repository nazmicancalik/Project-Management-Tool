var createError = require("http-errors");
var express = require("express");
var path = require("path");
var flash = require("connect-flash");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var methodOverride = require("method-override");
var bodyParser = require("body-parser");

// Authentication
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var projectsRouter = require("./routes/projects");
var employeesRouter = require("./routes/employees");
var managersRouter = require("./routes/managers");
var tasksRouter = require("./routes/tasks");

var app = express();

// view engine setup
// Register Partials
const hbs = require("hbs");
hbs.registerPartials(__dirname + "/views/partials");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

hbs.registerHelper("getDate", function(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
});

app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Express Session
app.use(
  session({
    secret: "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/projects", projectsRouter);
app.use("/employees", employeesRouter);
app.use("/managers", managersRouter);
app.use("/tasks", tasksRouter);

// Local Strategy
passport.use(
  "adminLogin",
  new LocalStrategy(
    ({
      usernameField: "email",
      passwordField: "password"
    },
    (username, password, done) => {
      /*knex("admins")
      .select()
      .where("email", email)
      .first()
      .then(admin => {
        if (!admin) {
          return done(null, false, { message: "Incorrect Username" });
        }
        if (admin.password !== password) {
          return done(null, false, { message: "Incorrect Password" });
        }
        return done(null, admin);
      });*/
      console.log(email);
      console.log(password);
      return done(null, "dsad");
    })
  )
);
/*
// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});
*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
