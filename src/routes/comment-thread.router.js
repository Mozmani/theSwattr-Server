const {
  CRUDService,
  SerializeService,
} = require('../../src/services');

const { TABLE_NAMES } = require('../../src/constants/db.constants');
const {
  auth,
  validate,
  Router,
  jsonBodyParser,
} = require('../../src/middlewares');

const commentThreadRouter = Router();
const TABLE_NAME = TABLE_NAMES.COMMENT_THREAD;

module.exports = commentThreadRouter;
