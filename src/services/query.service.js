// Use this file for advanced queries/table joins
const QueryService = {
  // ? makes sure new username is unique
  userNameExists(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
      .then((user) => !!user);
  },
};

module.exports = QueryService;
