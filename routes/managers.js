var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* ************* GET ROUTES ************* */
// Get all managers
router.get("/", admin(), (req, res) => {
  knex("managers")
    .select()
    .then(managers => {
      res.render("allManagers", { managers: managers });
    });
});

// New Manager
router.get("/new", admin(), (req, res) => {
  res.render("newManager");
});

// Get Edit Manager Page
router.get("/:id/edit", admin(), (req, res) => {
  const id = req.params.id;
  knex("managers")
    .select()
    .where("id", id)
    .first()
    .then(manager => {
      // console.log(JSON.stringify(project, undefined, 2));
      res.render("editManager", { manager: manager });
    });
});

// Get a specific manager
router.get("/:id", adminAndManager(), (req, res) => {
  const id = req.params.id;
  knex("managers")
    .select()
    .where("id", id)
    .first()
    .then(manager => {
      knex("projects")
        .innerJoin(
          "manager-project",
          "projects.id",
          "manager-project.project_id"
        )
        .where("manager_id", id)
        .then(projects => {
          res.render("singleManager", {
            manager: manager,
            projects: projects
          });
        });
    });
});

// Get a specific managers tasks
router.get("/:manager_id/tasks", adminAndManager(), (req, res) => {
  const manager_id = req.params.manager_id;
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
      res.render("managerTasks", { tasks: tasks });
    });
});

/* ************* POST ROUTES ************* */
// Create a new Manager
router.post("/", admin(), (req, res) => {
  validateManager(req, res, manager => {
    knex("managers")
      .insert(manager, "id")
      .then(ids => {
        const id = ids[0];
        const url = "/managers/" + id;
        res.redirect(url);
      });
  });
});

/* ************* PUT ROUTES ************* */
// Edit Specific Manager
router.put("/:id", admin(), (req, res) => {
  const id = req.params.id;
  const manager = {
    name: req.body.name,
    email: req.body.description,
    password: req.body.password
  };
  knex("managers")
    .where("id", id)
    .update(manager, "id")
    .then(() => {
      const url = "/managers/" + id;
      res.redirect(url);
    });
});

/* ************* DELETE ROUTES ************* */
router.delete("/:id", admin(), (req, res) => {
  const id = req.params.id;
  knex("managers")
    .where("id", id)
    .del()
    .then(() => {
      res.redirect("/managers");
    });
});

function validateManager(req, res, callback) {
  if (validManager(req.body)) {
    let manager = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    callback(manager);
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid Manager"
    });
  }
}

function validManager(manager) {
  return (
    typeof manager.name == "string" &&
    manager.name.trim() != "" &&
    typeof manager.email == "string" &&
    manager.email.trim() != "" &&
    typeof manager.password == "string" &&
    manager.password.trim() != ""
  );
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
    if (req.isAuthenticated()) {
      if (req.session.passport.user.isAdmin) {
        return next();
      }
    }
    res.redirect("/adminLogin");
  };
}

function adminAndManager() {
  return (req, res, next) => {
    console.log("Manager.js Admin and Manager Kilidi");
    console.log(
      `req.session.passport.user: ${JSON.stringify(
        req.session.passport,
        undefined,
        2
      )}`
    );
    if (req.isAuthenticated()) {
      console.log("Manager.js Admin and Manager Kilidinde Auth olmuşuz");
      if (req.session.passport.user.isAdmin) {
        return next();
      } else {
        let manager_id;
        if (req.params.id) {
          manager_id = req.params.id;
        } else {
          manager_id = req.params.manager_id;
        }
        if (manager_id == req.session.passport.user.id) {
          return next();
        }
      }
    }
    res.redirect("/adminLogin");
  };
}

module.exports = router;
