// Update with your config settings.

module.exports = {
  development: {
    client: "postgres",
    connection: "postgres://gray:nomad@localhost:5432/project_management"
  }
};
/*
var employee_after_delete = `
  CREATE TRIGGER employee_after_delete AFTER DELETE ON employees
  FOR EACH ROW
  BEGIN
    DELETE FROM employee-task
    WHERE employee-task.employee_id = OLD.id;
  END//
`;
instance.raw("DELIMETER //").then(() => {
  instance
    .raw(employee_after_delete)
    .catch(err => {
      // console.log(err);
      process.exit(1);
    })
    .then(() => {
      instance.raw("DELIMETER ;");
    });
});
*/
