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

// CREATE A PROJECT
router.post("/", (req, res) => {
  validateProjectRenderError(req, res, project => {
    knex("projects")
      .insert(project, "id")
      .then(ids => {
        const id = ids[0];
        res.redirect(`/projects/${id}`);
      });
  });
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

function validateProjectRenderError(req, res, callback) {
  if (validProject(req.body)) {
    const project = {
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      eta: req.body.eta,
      done: req.body.done
      //TODO ADD VALIDATIONS
    };

    callback(project);
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid todo"
    });
  }
}

function validProject(project) {
  return typeof project.title == "string" && project.title.trim() != "";
}

function validId(id) {
  return !isNaN(id);
}
module.exports = router;
