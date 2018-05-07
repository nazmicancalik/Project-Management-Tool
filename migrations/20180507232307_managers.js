/*
id
email
password
name
*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable("managers", table => {
    table.increments();
    table.text("name").notNullable();
    table.text("email").notNullable();
    table.text("password").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("managers");
};
