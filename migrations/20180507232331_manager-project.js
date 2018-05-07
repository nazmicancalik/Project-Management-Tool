/*
id
manager_id
project_id
*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable("manager-project", table => {
    table.increments();
    table
      .integer("manager_id")
      .notNullable()
      .references("id")
      .inTable("managers")
      .onDelete("cascade");
    table
      .integer("project_id")
      .notNullable()
      .references("id")
      .inTable("projects")
      .onDelete("cascade");
  });
};

exports.down = function(knex, Promise) {};
