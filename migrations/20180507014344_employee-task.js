/*
task_id
employee_id
*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable("employee-task", table => {
    table.increments();
    table
      .integer("task_id")
      .notNullable()
      .references("id")
      .inTable("tasks")
      .onDelete("cascade");
    table
      .integer("employee_id")
      .notNullable()
      .references("id")
      .inTable("employees")
      .onDelete("cascade");
  });
};

exports.down = function(knex, Promise) {};
