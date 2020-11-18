/*
* TODO - test this!
! select('*') can use an array of strings to target columns:
?   CRUDService.getAllData(db, TABLE_NAME, ['col1', 'col2', 'col3'])
! then in the method...
?   getAllData(db, table, cols) { return db(table).select([...cols]) };
*/

const CRUDService = {
  getAllData(db, table, cols = '*') {
    return db(table).select(cols);
  },

  getById(db, table, id, cols = '*') {
    return db(table).select(cols).where({ id }).first();
  },

  deleteById(db, table, id, cols = '*') {
    return db(table).returning(cols).where({ id }).del();
  },

  createEntry(db, table, newData, cols = '*') {
    return db(table).insert(newData, cols);
  },

  updateEntry(db, table, id, newData, cols = '*') {
    return db(table).where({ id }).update(newData, cols);
  },

  // special case for user login
  getByName(db, user_name, cols = '*') {
    return db('users').select(cols).where({ user_name }).first();
  },
};

module.exports = CRUDService;
