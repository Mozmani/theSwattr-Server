const { TABLE_NAMES } = require('../constants/db.constants');
const { CRUDService } = require('../services');
const { auth, Router } = require('../middlewares');

const TABLE_NAME = TABLE_NAMES.APP;
const SEV_TABLE = TABLE_NAMES.SEVERITY_LEVEL;
const STAT_TABLE = TABLE_NAMES.STATUS;

const appRouter = Router();

appRouter.use(auth.requireAuth);

appRouter.route('/').get(async (req, res, next) => {
  try {
    const rawApps = await CRUDService.getAllData(
      req.app.get('db'),
      TABLE_NAME,
    );

    const apps = await rawApps.map(({ id, app_name }) => {
      const formatName = app_name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { id, rawName: app_name, formatName };
    });

    res.status(200).json({ apps });
  } catch (error) {
    next(error);
  }
});

appRouter.route('/severity').get(async (req, res, next) => {
  try {
    const rawSev = await CRUDService.getAllData(
      req.app.get('db'),
      SEV_TABLE,
    );

    const returnedSevs = rawSev.map((sev) => {
      return sev.level;
    });

    res.status(200).json(returnedSevs);
  } catch (error) {
    next(error);
  }
});

appRouter.route('/status').get(async (req, res, next) => {
  try {
    const rawStats = await CRUDService.getAllData(
      req.app.get('db'),
      STAT_TABLE,
    );

    const returnedStats = rawStats.map((status) => {
      return status.status_name;
    });

    res.status(200).json(returnedStats);
  } catch (error) {
    next(error);
  }
});

module.exports = appRouter;
