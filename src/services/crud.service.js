//basic CRUD requests
const CRUDService = {
  getAllData(db, table) {
    return db(table);
  },

  getAllByOrder(db, table, order, direction = 'asc') {
    return db(table).orderBy(order, direction);
  },

  getAllBySearchOrder(
    db,
    table,
    colName,
    colVal,
    order,
    direction = 'asc',
  ) {
    return db(table).where(colName, colVal).orderBy(order, direction);
  },

  getBySearch(db, table, colName, colVal) {
    return db(table).where(colName, colVal).first();
  },

  createEntry(db, table, newData) {
    return db(table).insert(newData, '*');
  },

  updateEntry(db, table, colName, colVal, newData) {
    return db(table).where(colName, colVal).update(newData, '*');
  },

  deleteEntry(db, table, colName, colVal) {
    return db(table).where(colName, colVal).del();
  },

  updateDevField(db, user_name, dev) {
    return db('users').where({ user_name }).update({ dev }, '*');
  },

  // ? for updating linkage tables
  updateFieldByBugId(db, table, bug_id, colName, newVal) {
    return db(table)
      .where({ bug_id })
      .update({ [colName]: newVal }, '*');
  },
};

module.exports = CRUDService;
