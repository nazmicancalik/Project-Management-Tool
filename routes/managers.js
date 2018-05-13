var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* ************* GET ROUTES ************* */
// Get all managers
router.get("/", adminAuthenticationMiddleware(), (req, res) => {
  knex("managers")
    .select()
    .then(managers => {
      res.render("allManagers", { managers: managers });
    });
});

// New Manager
router.get("/new", adminAuthenticationMiddleware(), (req, res) => {
  res.render("newManager");
});

// Get Edit Manager Page
router.get("/:id/edit", adminAuthenticationMiddleware(), (req, res) => {
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

/* ************* POST ROUTES ************* */
// Create a new Manager
router.post("/", adminAuthenticationMiddleware(), (req, res) => {
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
router.put("/:id", adminAuthenticationMiddleware(), (req, res) => {
  const id = req.params.id;
  // console.log(JSON.stringify(req.body, undefined, 2));
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

// Get a specific manager
router.get("/:id", adminAuthenticationMiddleware(), (req, res) => {
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

/* ************* DELETE ROUTES ************* */
router.delete("/:id", adminAuthenticationMiddleware(), (req, res) => {
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
