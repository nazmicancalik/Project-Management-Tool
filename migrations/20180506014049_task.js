/*
title
description
start_date
duration
project_id
done
*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable("task", table => {
    table.increments();
    table.text("title").notNullable();
    table.text("description");
    table.datetime("start_date");
    table.integer("duration").notNullable();
    table.integer("project_id");
    table.boolean("done").defaultTo(false);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("task");
};
