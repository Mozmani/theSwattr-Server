const CRUDService = {
  getAllData(db, table) {
    return db(table);
  },

  getAllDataByOrder(db, table, order, direction = 'asc') {
    return db(table).orderBy(order, direction);
  },

  getAllBySearch(db, table, colName, colVal) {
    return db(table).where(colName, colVal);
  },

  getBySearch(db, table, colName, colVal) {
    return db(table).where(colName, colVal).first();
  },

  deleteBySearch(db, table, colName, colVal) {
    return db(table).where(colName, colVal).del();
  },

  createEntry(db, table, newData) {
    return db(table).insert(newData, '*');
  },

  updateEntry(db, table, colName, colVal, newData) {
    return db(table).where(colName, colVal).update(newData, '*');
  },

  updateFieldByBugId(db, table, colName, newVal, bug_id) {
    return db(table)
      .update({ [colName]: newVal }, '*')
      .where({ bug_id });
  },
};

module.exports = CRUDService;
