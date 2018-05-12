var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* ************* GET ROUTES ************* */
// Get all managers
router.get("/", (req, res) => {
  knex("managers")
    .select()
    .then(managers => {
      res.render("allManagers", { managers: managers });
    });
});

// Get a specific manager
router.get("/:id", (req, res) => {
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
          res.render("singleManager", { manager: manager, projects: projects });
        });
    });
});

/* ************* DELETE ROUTES ************* */
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  knex("managers")
    .where("id", id)
    .del()
    .then(() => {
      res.redirect("/managers");
    });
});

module.exports = router;
