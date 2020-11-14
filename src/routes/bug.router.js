const {
  CRUDService,
  SerializeService,
} = require('../../src/services');

const { TABLE_NAMES } = require('../..src/constants/db.constants');
const {
  auth,
  validate,
  Router,
  jsonBodyParser,
} = require('../../src/middlewares');

const bugRouter = Router();
const TABLE_NAME = TABLE_NAMES.BUG;

module.exports = bugRouter;
