exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("employee-task")
    .del()
    .then(function() {
      const rels = [
        {
          task_id: 1,
          employee_id: 1
        },
        {
          task_id: 2,
          employee_id: 3
        },
        {
          task_id: 3,
          employee_id: 2
        },
        {
          task_id: 4,
          employee_id: 4
        }
      ];
      return knex("employee-task").insert(rels);
    });
};
