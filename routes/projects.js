var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* This Router Starts from /projects */
/* ************** GET ROUTES ************** */
router.get("/", admin(), function(req, res, next) {
  knex("projects")
    .select()
    .then(projects => {
      // // console.log(JSON.stringify(projects, undefined, 2));
      res.render("projects", { projects: projects });
    });
});

// ADD A NEW PROJECT
router.get("/new", admin(), (req, res) => {
  // Fetch the managers first
  knex("managers")
    .select()
    .then(managers => {
      // console.log(JSON.stringify(managers, undefined, 2));
      res.render("newProject", { managers: managers });
    });
});

// ADD A NEW TASK
router.get("/:id/tasks/new", adminAndManager(), (req, res) => {
  const id = req.params.id;
  // console.log("****************************");
  knex("employees")
    .select()
    .then(employees => {
      // console.log(JSON.stringify(employees, undefined, 2));
      res.render("newTask", { project_id: id, employees: employees });
    });
});

// GET A SPECIFIC PROJECT
router.get("/:id", adminAndManager(), (req, res) => {
  const id = req.params.id;
  respondAndRenderProject(id, res, "singleProject");
});

// GET EDIT SCREEN
router.get("/:id/edit", admin(), (req, res) => {
  const project_id = req.params.id;
  knex("projects")
    .select()
    .where("id", project_id)
    .first()
    .then(project => {
      // // console.log(JSON.stringify(project, undefined, 2));
      res.render("editProject", { project: project });
    });
});

// GET TASKS
router.get("/:id/tasks", adminAndManager(), (req, res) => {
  const id = req.params.id;
  respondAndRenderTasks(id, res, "tasks");
});

// GET MANAGERS
router.get("/:id/managers", admin(), (req, res) => {
  const id = req.params.id;
  knex("managers")
    .innerJoin("manager-project", "manager-project.manager_id", "managers.id")
    .select()
    .where("project_id", id)
    .then(managers => {
      // // console.log(JSON.stringify(managers, undefined, 2));
      knex("managers")
        .select()
        .whereNotIn(
          "id",
          knex("manager-project")
            .select("manager_id")
            .where("project_id", id)
        )
        .then(other_managers => {
          // console.log(JSON.stringify(other_managers, undefined, 2));
          res.render("managers", {
            managers: managers,
            other_managers: other_managers,
            project: id
          });
        });
    });
});

/* ************** PUT ROUTES ************** */
router.post("/:project_id", admin(), (req, res) => {
  const project_id = req.params.project_id;
  // console.log(JSON.stringify(req.body, undefined, 2));
  const project = {
    title: req.body.title,
    description: req.body.description,
    start_date: req.body.start_date,
    eta: req.body.eta
  };
  knex("projects")
    .where("id", project_id)
    .update(project, "id")
    .then(() => {
      const url = "/projects/" + project_id;
      res.redirect(url);
    });
});

/* ************** POST ROUTES ************** */
// CREATE A PROJECT
router.post("/", admin(), (req, res) => {
  validateProjectRenderError(req, res, project => {
    // console.log(req.body);
    knex("projects")
      .insert(project, "id")
      .then(ids => {
        const id = ids[0];
        return id;
      })
      .then(id => {
        validateManagerProjectRelationRenderError(id, req, res, rels => {
          if (rels === undefined || rels.length == 0) {
            res.redirect(`/projects/${id}`);
          } else {
            knex("manager-project")
              .insert(rels)
              .then(() => {
                res.redirect(`/projects/${id}`);
              });
          }
        });
      });
  });
});

// Create a Task
router.post("/:project_id/tasks", adminAndManager(), (req, res) => {
  const project_id = req.params.project_id;
  validateTaskRenderError(req, res, task => {
    task.project_id = project_id;
    knex("tasks")
      .insert(task, "id")
      .then(ids => {
        const id = ids[0];
        res.redirect(`/tasks/${id}`);
      });
  });
});

// Add a new manager
router.post("/:project_id/managers/:manager_id", admin(), (req, res) => {
  const manager_id = req.params.manager_id;
  const project_id = req.params.project_id;
  // // console.log(JSON.stringify(req.body, undefined, 2));
  const rel = {
    manager_id: manager_id,
    project_id: project_id
  };
  knex("manager-project")
    .insert(rel)
    .then(() => {
      const url = "/projects/" + project_id + "/managers";
      res.redirect(url);
    });
});

/* ************** DELETE ROUTES ************** */
// Delete the specific manager-project relation
router.delete("/:project_id/managers/:manager_id", admin(), (req, res) => {
  const manager_id = req.params.manager_id;
  const project_id = req.params.project_id;
  // console.log(JSON.stringify(req.body, undefined, 2));
  knex("manager-project")
    .where("manager_id", manager_id)
    .andWhere("project_id", project_id)
    .del()
    .then(() => {
      const url = "/projects/" + project_id + "/managers";
      res.redirect(url);
    });
});

router.delete("/:project_id", admin(), (req, res) => {
  const id = req.params.project_id;
  knex("projects")
    .where("id", id)
    .del()
    .then(() => {
      res.redirect("/projects");
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

function respondAndRenderTasks(id, res, viewName) {
  if (validId(id)) {
    knex("tasks")
      .select()
      .where("project_id", id)
      .then(tasks => {
        // console.log(JSON.stringify(tasks, undefined, 2));
        res.render(viewName, { tasks: tasks, project_id: id, canCreate: true });
      });
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid id"
    });
  }
}

function respondAndRenderSingleTask(id, res, viewName) {
  if (validId(id)) {
    knex("tasks")
      .select()
      .where("id", id)
      .first()
      .then(task => {
        // console.log(JSON.stringify(task, undefined, 2));
        res.render(viewName, task);
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
    };

    callback(project);
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid todo"
    });
  }
}

function validateManagerProjectRelationRenderError(id, req, res, callback) {
  if (id != "undefined") {
    var rels = [];
    if (req.body.managers) {
      for (var i = 0; i < req.body.managers.length; i++) {
        let obj = {};
        obj.manager_id = req.body.managers[i];
        obj.project_id = id;
        rels.push(obj);
      }
    }
    callback(rels);
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid todo"
    });
  }
}

function validateTaskRenderError(req, res, callback) {
  // console.log(req.body);
  if (validTask(req.body)) {
    const task = {
      title: req.body.title,
      description: req.body.description,
      start_date: req.body.start_date,
      duration: req.body.duration,
      done: false
    };

    callback(task);
  } else {
    res.status(500);
    res.render("error", {
      message: "Invalid task"
    });
  }
}

function validTask(task) {
  return typeof task.title == "string" && task.title.trim() != "";
}

function validProject(project) {
  return typeof project.title == "string" && project.title.trim() != "";
}

function validId(id) {
  return !isNaN(id);
}

function admin() {
  return (req, res, next) => {
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
    if (req.isAuthenticated()) {
      if (req.session.passport.user.isAdmin) {
        return next();
      } else {
        const manager_id = req.session.passport.user.id;
        knex("projects")
          .innerJoin(
            "manager-project",
            "projects.id",
            "manager-project.project_id"
          )
          .where("manager_id", manager_id)
          .then(projects => {
            let project_id;
            if (req.params.id) {
              project_id = req.params.id;
            } else {
              project_id = req.params.project_id;
            }
            for (var i = 0; i < projects.length; i++) {
              if (
                projects[i].project_id == project_id ||
                projects[i].project_id == project_id
              ) {
                return next();
              }
            }
          });
      }
    }
  };
}
module.exports = router;
