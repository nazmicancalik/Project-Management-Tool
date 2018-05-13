var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* This Router Starts from /projects */
/* ************** GET ROUTES ************** */
router.get("/", adminAuthenticationMiddleware(), function(req, res, next) {
  knex("employees")
    .select()
    .then(employees => {
      // console.log(JSON.stringify(employees, undefined, 2));
      res.render("employees", { employees: employees });
    });
});

// ADD A NEW EMPLOYEE
router.get("/new", adminAuthenticationMiddleware(), (req, res) => {
  res.render("newEmployee");
});

// GET A SPECIFIC EMPLOYEE
router.get("/:id", adminAuthenticationMiddleware(), (req, res) => {
  const id = req.params.id;
  respondAndRenderEmployee(id, res, "singleEmployee");
});

// GET TASKS
router.get("/:id/tasks", adminAuthenticationMiddleware(), (req, res) => {
  const id = req.params.id;
  respondAndRenderTasks(id, res, "employeeTasks");
});

/* ************** POST ROUTES ************** */
// CREATE AN EMPLOYEE
router.post("/", adminAuthenticationMiddleware(), (req, res) => {
  validateEmployeeRenderError(req, res, employee => {
    knex("employees")
      .insert(employee, "id")
      .then(ids => {
        const id = ids[0];
        res.redirect(`/employees/${id}`);
      });
  });
});

function validateEmployeeRenderError(req, res, callback) {
  if (req.body.name != "undefined") {
    const employee = {
      name: req.body.name
    };

    callback(employee);
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid employee"
    });
  }
}

function respondAndRenderEmployee(id, res, viewName) {
  if (id != "undefined") {
    knex("employees")
      .select()
      .where("id", id)
      .first()
      .then(employee => {
        res.render(viewName, employee);
      });
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid id"
    });
  }
}

function respondAndRenderTasks(id, res, viewName) {
  if (validId(id)) {
    knex("tasks")
      .join("employee-task", "employee-task.task_id", "tasks.id")
      .select()
      .where("employee_id", id)
      .then(tasks => {
        console.log(JSON.stringify(tasks, undefined, 2));
        res.render(viewName, { tasks: tasks, employee_id: id });
      });
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid id"
    });
  }
}

function validId(id) {
  return !isNaN(id);
}

function adminAuthenticationMiddleware() {
  return (req, res, next) => {
    console.log(
      `req.session.passport.user: ${JSON.stringify(
        req.session.passport,
        undefined,
        2
      )}`
    );
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/adminLogin");
  };
}
module.exports = router;
