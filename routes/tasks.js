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

/* ************* DELETE ROUTES ************* */
router.delete("/:task_id", (req, res) => {
  const task_id = req.params.task_id;
  knex("tasks")
    .where("id", task_id)
    .del("project_id")
    .then(project_id => {
      const url = "/projects/" + project_id + "/tasks";
      res.redirect(url);
    });
});

module.exports = router;
