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

/* ************* POST ROUTES ************* */
router.post("/", (req, res) => {
  console.log(JSON.stringify(req.body, undefined, 2));
  const task = {
    title: req.body.title,
    description: req.body.description,
    start_date: req.body.start_date,
    duration: req.body.duration,
    project_id: req.body.project_id,
    done: false
  };
  console.log(req.body.employees);
  knex("tasks")
    .insert(task, "id")
    .then(ids => {
      const id = ids[0];
      return id;
    })
    .then(id => {
      validateEmployeeTaskRelationRenderError(id, req, res, rels => {
        knex("employee-task")
          .insert(rels)
          .then(() => {
            res.redirect(`/tasks/${id}`);
          });
      });
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

function validateEmployeeTaskRelationRenderError(id, req, res, callback) {
  if (id != "undefined") {
    var rels = [];
    for (var i = 0; i < req.body.employees.length; i++) {
      let obj = {};
      obj.employee_id = req.body.employees[i];
      obj.task_id = id;
      rels.push(obj);
    }

    callback(rels);
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid index"
    });
  }
}
module.exports = router;
