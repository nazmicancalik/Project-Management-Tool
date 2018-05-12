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

router.get("/:id", (req, res) => {
  const id = req.params.id;
  knex("tasks")
    .select()
    .where("id", id)
    .first()
    .then(task => {
      res.render("singleTask", task);
    });
});
// GET EDIT SCREEN
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  knex("tasks")
    .select()
    .where("id", id)
    .first()
    .then(task => {
      // console.log(JSON.stringify(project, undefined, 2));
      res.render("editTask", { task: task });
    });
});

/* ************* PUT ROUTES ************* */
router.put("/:id", (req, res) => {
  const id = req.params.id;
  // console.log(JSON.stringify(req.body, undefined, 2));
  const task = {
    title: req.body.title,
    description: req.body.description,
    start_date: req.body.start_date,
    duration: req.body.duration,
    done: req.body.done
  };
  knex("tasks")
    .where("id", id)
    .update(task, "id")
    .then(() => {
      const url = "/tasks/" + id;
      res.redirect(url);
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
