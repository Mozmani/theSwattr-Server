const { TABLE_NAMES } = require('../constants/db.constants');
const { CRUDService } = require('../services');
const { auth, Router } = require('../middlewares');

const TABLE_NAME = TABLE_NAMES.APP;

const appRouter = Router();

appRouter.use(auth.requireAuth);

appRouter.route('/').get(async (req, res, next) => {
  try {
    const rawApps = await CRUDService.getAllData(
      req.app.get('db'),
      TABLE_NAME,
    );

    const apps = rawApps.map(({ id, app_name }) => {
      const appName = app_name
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      return { id, appName };
    });

    res.status(200).json({ apps });
  } catch (error) {
    next(error);
  }
});

module.exports = appRouter;
