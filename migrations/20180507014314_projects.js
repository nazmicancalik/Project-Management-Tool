/*
id
title
description
start_date
estimated_finish_time (eta)
done
*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable("projects", table => {
    table.increments();
    table.text("title").notNullable();
    table.text("description");
    table.date("start_date");
    table.integer("eta").notNullable();
    table.boolean("done").defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("projects");
};
