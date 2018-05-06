var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* This Router Starts from /projects */
router.get("/", function(req, res, next) {
  knex("projects")
    .select()
    .then(projects => {
      console.log(JSON.stringify(projects, undefined, 2));
      res.render("projects", { projects: projects });
    });
});

module.exports = router;
