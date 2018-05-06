var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* This Router Starts from /tasks */
router.get("/", function(req, res, next) {
  knex("tasks")
    .select()
    .then(tasks => {
      res.render("tasks", { tasks: tasks });
      //For debug
      console.log(JSON.stringify(tasks, undefined, 2));
    });
});

module.exports = router;
