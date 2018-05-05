exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("task")
    .del()
    .then(function() {
      const tasks = [
        {
          title: "Make a call",
          description: "description",
          start_date: new Date(),
          duration: 2,
          project_id: 1
        },
        {
          title: "Create the tables",
          description: "description sd s d",
          start_date: new Date(),
          duration: 4,
          project_id: 1
        },
        {
          title: "Review code",
          description: "description 34343",
          start_date: new Date(),
          duration: 5,
          project_id: 2
        },
        {
          title: "Get the phones",
          description: "description sdsf",
          start_date: new Date(),
          duration: 34,
          project_id: 3
        }
      ];
      return knex("task").insert(tasks);
    });
};
