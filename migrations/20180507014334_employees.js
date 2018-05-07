/*
id
name
*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable("employees", table => {
    table.increments();
    table.text("name").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("employees");
};
