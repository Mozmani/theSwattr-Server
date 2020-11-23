const { TABLE_NAMES } = require('../constants/db.constants');
const {
  CRUDService,
  QueryService,
  SerializeService,
} = require('../services');
const {
  auth,
  validate,
  Router,
  jsonBodyParser,
} = require('../middlewares');
const bugRouter = require('./bug.router');

const TABLE_NAME = TABLE_NAMES.APP;

const appRouter = Router();

appRouter
  .route('/')
  .get(async (req, res, next) => {
   try {
    let apps = await CRUDService.getAllData(
      req.app.get('db'),
      TABLE_NAME,
    )
    res.status(200).json({ apps });
   } catch (error) {
    next(error);
  }
    

  });


module.exports = appRouter;