/*
* TODO - test this!
! select('*') can use an array of strings to target columns:
?   CRUDService.getAllData(db, TABLE_NAME, ['col1', 'col2', 'col3'])
! then in the method...
?   getAllData(db, table, '*') { return db(table).select([...'*']) };
*/

const CRUDService = {
  getAllData(db, table) {
    return db(table).select('*');
  },

  getById(db, table, id) {
    return db(table).select('*').where({ id }).first();
  },

  deleteById(db, table, id) {
    return db(table).returning('*').where({ id }).del();
  },

  async createEntry(db, table, newData) {
    return db(table).insert(newData, '*');
  },

  updateEntry(db, table, id, newData) {
    return db(table).where({ id }).update(newData, '*');
  },

  // special case for user login
  getByName(db, user_name) {
    console.log('CHECKER2', user_name);
    return db('users').where({ user_name }).first('*');
  },
};

module.exports = CRUDService;
