const CRUDService = {
  getAllData(db, table) {
    return db(table).select('*');
  },

  getById(db, table, id) {
    return db(table).where({ id }).first();
  },

  deleteById(db, table, id) {
    return db(table).where({ id }).del();
  },

  createEntry(db, table, newSong) {
    return db(table).insert(newSong, '*');
  },

  updateEntry(db, table, id, newSong) {
    return db(table).where({ id }).update(newSong, '*');
  },

  // special case for user login
  getByName(db, user_name) {
    return db('users').where({ user_name }).first();
  },
};

module.exports = CRUDService;
