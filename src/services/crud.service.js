const CRUDService = {
  getAllData(db, table) {
    return db(table);
  },

  getAllBySearch(db, table, search) {
    return db(table).where({ search });
  },

  getBySearch(db, table, search) {
    return db(table).where({ search }).first();
  },

  deleteBySearch(db, table, search) {
    return db(table).where({ search }).del();
  },

  async createEntry(db, table, newData) {
    return db(table).insert(newData, '*');
  },

  updateEntry(db, table, search, newData) {
    return db(table).where({ search }).update(newData, '*');
  },
};

module.exports = CRUDService;
