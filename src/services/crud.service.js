const CRUDService = {
  getAllData(db, table) {
    return db(table);
  },
  getAllDataOrder(db, table, order){
    return db(table).orderBy(order);
  },

  getAllBySearch(db, table, colName, colVal) {
    return db(table).where(colName, colVal);
  },

  getBySearch(db, table, colName, colVal) {
    return db(table).where(colName, colVal).first();
  },
  getBySearchLog(db, table, val) {
    return db(table).where({ val }).first();
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
  updateEasy(db, table, colName, newVal, bugId) {
    return db.raw(`update ${table}
    set ${colName} = ${newVal}
    where bug_id =${bugId};`);
  },
};

module.exports = CRUDService;
