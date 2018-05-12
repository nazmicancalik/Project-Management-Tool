var express = require("express");
var router = express.Router();

const knex = require("../db/knex");

/* ************* GET ROUTES ************* */
router.get("/", (req, res) => {
  knex("managers")
    .select()
    .then(managers => {
      res.render("allManagers", { managers: managers });
    });
});

module.exports = router;
