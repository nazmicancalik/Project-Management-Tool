/*
id
email
password
*/
exports.up = function(knex, Promise) {
  return knex.schema.createTable("admins", table => {
    table.increments();
    table.text("email").notNullable();
    table.text("password").notNullable();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable("admins");
};
