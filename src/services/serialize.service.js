const xss = require('xss');

const {
  TABLE_NAMES,
  USERS_TABLE,
} = require('../constants/db.constants');

const { BUG, COMMENT_THREAD, USERS } = TABLE_NAMES;

const SerializeService = {
  serializeObject(rawObject) {
    const keyVals = Object.entries(rawObject);

    keyVals.forEach(([key, value]) => (rawObject[key] = xss(value)));

    return rawObject;
  },

  serializeAll(rawArray) {
    return rawArray.map(this.serializeObject);
  },

  // serializeUser(user) {
  //   USERS_TABLE.forEach((field) => {
  //     if (user[field]) user[field] = xss(user[field]);
  //   });
  //   return user;
  // },

  // serializeBug(bug) {
  //   bug.bug_name = xss(bug.bug_name);
  //   bug.description = xss(bug.description);
  //   return bug;
  // },

  // serializeComment(comment) {
  //   comment.comment = xss(comment.comment);
  //   return comment;
  // },

  // serializeData(table, data) {
  //   switch (table) {
  //     case USERS:
  //       return data.map(this.serializeUser);

  //     case BUG:
  //       return data.map(this.serializeBug);

  //     case COMMENT_THREAD:
  //       return data.map(this.serializeComment);

  //     default:
  //       return { message: 'Serialization failed' };
  //   }
  // },
};

module.exports = SerializeService;
