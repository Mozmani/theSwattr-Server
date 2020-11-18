const CRUDService = {
  getAllData(db, table) {
    return db(table);
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

  async createEntry(db, table, newData) {
    return db(table).insert(newData, '*');
  },

  updateEntry(db, table, colName, colVal, newData) {
    return db(table).where(colName, colVal).update(newData, '*');
  },
};

module.exports = CRUDService;
