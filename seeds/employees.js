exports.seed = function(knex, Promise) {
  return knex("employees")
    .del()
    .then(function() {
      const employees = [
        {
          name: "Ahmet"
        },
        {
          name: "Kemal"
        },
        {
          name: "İsmet"
        },
        {
          name: "Çağdaş"
        }
      ];
      return knex("employees").insert(employees);
    });
};
