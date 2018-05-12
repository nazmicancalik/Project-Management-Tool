var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* ************* GET ROUTES ************* */
router.get("/", (req, res) => {
  knex("tasks")
    .select()
    .then(tasks => {
      res.render("tasks", { tasks: tasks });
    });
});

module.exports = router;
