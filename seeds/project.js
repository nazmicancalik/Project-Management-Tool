/*
id
title
description
start_date
estimated_finish_time (eta)
done
*/
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("project")
    .del()
    .then(function() {
      const projects = [
        {
          title: "Konsl",
          description: "descsdriptionds",
          start_date: new Date(),
          eta: 2
        },
        {
          title: "TensorFlow",
          description: "Machine Learning Library",
          start_date: new Date(),
          eta: 78
        },
        {
          title: "Memory Place",
          description: "Memory Place app",
          start_date: new Date(),
          eta: 90
        },
        {
          title: "Db Project",
          description: "Datatbase project",
          start_date: new Date(),
          eta: 54
        }
      ];
      return knex("project").insert(projects);
    });
};
