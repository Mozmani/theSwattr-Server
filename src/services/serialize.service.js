const xss = require('xss');

const {
  TABLE_NAMES: { BUG, COMMENT_THREAD },
} = require('../constants/db.constants');
const {
  USERS_CLIENT_RETURN,
  BUG_CLIENT_RETURN,
  COMMENT_THREAD_CLIENT_RETURN,
} = require('../constants/db-returns.constants');


//serialize service
const SerializeService = {
  //sanitizes object
  sanitizeObject(rawObject) {
    const keyVals = Object.entries(rawObject);

    keyVals.forEach(([key, value]) => (rawObject[key] = xss(value)));

    return rawObject;
  },

  //sanitize all
  sanitizeAll(rawArray) {
    return rawArray.map(this.serializeObject);
  },

  //formats user for response
  formatUser(rawUser) {
    const keyVals = Object.entries(USERS_CLIENT_RETURN);

    const user = {};
    keyVals.forEach(([key, value]) => (user[key] = rawUser[value]));

    return user;
  },

  //formats bug for response
  formatBug(rawBug) {
    const keyVals = Object.entries(BUG_CLIENT_RETURN);

    const bug = {};
    keyVals.forEach(([key, value]) => (bug[key] = rawBug[value]));

    return bug;
  },

  //formats comment for response
  formatComment(rawComment) {
    const keyVals = Object.entries(COMMENT_THREAD_CLIENT_RETURN);

    const comment = {};
    keyVals.forEach(
      ([key, value]) => (comment[key] = rawComment[value]),
    );

    return comment;
  },

  //standard format all
  formatAll(data, tableName) {
    switch (tableName) {
      case BUG:
        return data.map(this.formatBug);

      case COMMENT_THREAD:
        return data.map(this.formatComment);

      default:
        return null;
    }
  },
};

module.exports = SerializeService;
