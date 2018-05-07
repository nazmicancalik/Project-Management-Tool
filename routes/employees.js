var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* This Router Starts from /projects */
/* ************** GET ROUTES ************** */
router.get("/", function(req, res, next) {
  knex("employees")
    .select()
    .then(employees => {
      // console.log(JSON.stringify(employees, undefined, 2));
      res.render("employees", { employees: employees });
    });
});

module.exports = router;
