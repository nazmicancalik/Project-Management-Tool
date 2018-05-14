var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* ************* GET ROUTES ************* */
router.get("/", admin(), (req, res) => {
  knex("tasks")
    .select()
    .then(tasks => {
      res.render("tasks", { tasks: tasks });
    });
});

router.get("/:id", adminAndManager(), (req, res) => {
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
router.get("/:id/edit", adminAndManager(), (req, res) => {
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

// Get Employees
router.get("/:id/employees", adminAndManager(), (req, res) => {
  const id = req.params.id;
  knex("employees")
    .innerJoin("employee-task", "employee-task.employee_id", "employees.id")
    .select()
    .where("task_id", id)
    .then(employees => {
      // console.log(JSON.stringify(managers, undefined, 2));
      knex("employees")
        .select()
        .whereNotIn(
          "id",
          knex("employee-task")
            .select("employee_id")
            .where("task_id", id)
        )
        .then(other_employees => {
          console.log(JSON.stringify(other_employees, undefined, 2));
          res.render("employeeTask", {
            employees: employees,
            other_employees: other_employees,
            task: id
          });
        });
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

// Add a new employee
router.post(
  "/:task_id/employees/:employee_id",
  adminAndManager(),
  (req, res) => {
    const employee_id = req.params.employee_id;
    const task_id = req.params.task_id;
    // console.log(JSON.stringify(req.body, undefined, 2));
    const rel = {
      employee_id: employee_id,
      task_id: task_id
    };
    knex("employee-task")
      .insert(rel)
      .then(() => {
        const url = "/tasks/" + task_id + "/employees";
        res.redirect(url);
      });
  }
);

/* ************* PUT ROUTES ************* */
router.put("/:id", adminAndManager(), (req, res) => {
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
router.delete("/:task_id", adminAndManager(), (req, res) => {
  const task_id = req.params.task_id;
  knex("tasks")
    .where("id", task_id)
    .del("project_id")
    .then(project_id => {
      const url = "/projects/" + project_id + "/tasks";
      res.redirect(url);
    });
});

// Delete the specific manager-project relation
router.delete(
  "/:task_id/employees/:employee_id",
  adminAndManager(),
  (req, res) => {
    const employee_id = req.params.employee_id;
    const task_id = req.params.task_id;
    console.log(JSON.stringify(req.body, undefined, 2));
    knex("employee-task")
      .where("employee_id", employee_id)
      .andWhere("task_id", task_id)
      .del()
      .then(() => {
        const url = "/tasks/" + task_id + "/employees";
        res.redirect(url);
      });
  }
);

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

function admin() {
  return (req, res, next) => {
    console.log(
      `req.session.passport.user: ${JSON.stringify(
        req.session.passport,
        undefined,
        2
      )}`
    );
    if (req.isAuthenticated() && req.session.passport.user.isAdmin) {
      return next();
    }
    res.redirect("/adminLogin");
  };
}

function adminAndManager() {
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
      } else {
        const manager_id = req.session.passport.user.id;
        knex("tasks")
          .select()
          .whereIn(
            "project_id",
            knex("projects")
              .select("project_id")
              .innerJoin(
                "manager-project",
                "projects.id",
                "manager-project.project_id"
              )
              .where("manager_id", manager_id)
          )
          .then(tasks => {
            let task_id;
            if (req.params.id) {
              task_id = req.params.id;
            } else {
              task_id = req.params.task_id;
            }
            for (var i = 0; i < tasks.length; i++) {
              if (tasks[i].id == task_id) {
                return next();
              }
            }
          });
      }
    }
  };
}
module.exports = router;
