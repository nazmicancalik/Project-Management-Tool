var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* This Router Starts from /projects */
router.get("/", function(req, res, next) {
  knex("projects")
    .select()
    .then(projects => {
      console.log(JSON.stringify(projects, undefined, 2));
      res.render("projects", { projects: projects });
    });
});

// ADD A NEW PROJECT
router.get("/new", (req, res) => {
  res.render("newProject");
});

// GET A SPECIFIC PROJECT
router.get("/:id", (req, res) => {
  const id = req.params.id;
  respondAndRenderProject(id, res, "singleProject");
});

function respondAndRenderProject(id, res, viewName) {
  if (validId(id)) {
    knex("projects")
      .select()
      .where("id", id)
      .first()
      .then(project => {
        res.render(viewName, project);
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
module.exports = router;
