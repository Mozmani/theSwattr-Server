const xss = require('xss');

const {
  TABLE_NAMES,
  BUG_TABLE,
  COMMENT_THREAD_TABLE,
  USERS_TABLE,
} = require('../constants/db.constants');

const { BUG, COMMENT_THREAD, USERS } = TABLE_NAMES;

const SerializeService = {
  serializeBug(bug) {
    BUG_TABLE.forEach((field) => (bug[field] = xss(bug[field])));
    return bug;
  },

  serializeBug(comment) {
    COMMENT_THREAD_TABLE.forEach(
      (field) => (comment[field] = xss(comment[field])),
    );
    return comment;
  },

  serializeBug(user) {
    USERS_TABLE.forEach((field) => (user[field] = xss(user[field])));
    return user;
  },

  serializeData(table, data) {
    switch (table) {
      case BUG:
        return data.map(this.serializeSomething);

      case COMMENT_THREAD:
        return data.map(this.serializeSomething);

      case USERS:
        return data.map(this.serializeSomething);

      default:
        return { message: 'Serialization failed' };
    }
  },
};

module.exports = SerializeService;
