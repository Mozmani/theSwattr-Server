/*
* TODO - test this!
! select('*') can use an array of strings to target columns:
?   CRUDService.getAllData(db, TABLE_NAME, ['col1', 'col2', 'col3'])
! then in the method...
?   getAllData(db, table, cols) { return db(table).select([...cols]) };
*/

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

  createEntry(db, table, newData) {
    return db(table).insert(newData, '*');
  },

  updateEntry(db, table, id, newData) {
    return db(table).where({ id }).update(newData, '*');
  },

  // special case for user login
  getByName(db, user_name) {
    return db('users').where({ user_name }).first();
  },
};

module.exports = CRUDService;
