const { TABLE_NAMES } = require('../constants/db.constants');
const { auth, Router } = require('../middlewares');
const {
  CRUDService,
  QueryService,
  SerializeService,
} = require('../services');

const TABLE_NAME = TABLE_NAMES.BUG;

const sortBugsRouter = Router();

sortBugsRouter.use(auth.requireAuth);

sortBugsRouter.route('/status/:app').get(async (req, res, next) => {
  try {
    const app = req.params.app.replace(/-/g, ' ');
    const { dev, user_name } = req.dbUser;

    const rawBugs = dev
      ? await CRUDService.getAllDataByOrder(
          req.app.get('db'),
          TABLE_NAME,
          'updated_at',
        )
      : await CRUDService.getAllBySearch(
          req.app.get('db'),
          'user_name',
          user_name,
        );

    const pending = [],
      open = [],
      closed = [],
      dormant = [];
    for (let i = 0; i < rawBugs.length; i++) {
      const thisBug = rawBugs[i];

      const links = await QueryService.grabBugLinkages(
        req.app.get('db'),
        thisBug.id,
      );

      if (links.app_name === app) {
        thisBug.status = links.status_name;
        thisBug.app = links.app_name;
        thisBug.severity = links.level;

        switch (thisBug.severity) {
          case 'pending':
            pending.push(thisBug);
            break;

          case 'open':
            open.push(thisBug);
            break;

          case 'closed':
            closed.push(thisBug);
            break;

          case 'dormant':
            dormant.push(thisBug);
            break;

          default:
            break;
        }
      }
    }

    const bugsPending = SerializeService.formatAll(
        pending,
        TABLE_NAME,
      ),
      bugsOpen = SerializeService.formatAll(open, TABLE_NAME),
      bugsClosed = SerializeService.formatAll(closed, TABLE_NAME),
      bugsDormant = SerializeService.formatAll(dormant, TABLE_NAME);

    res
      .status(200)
      .json({ bugsPending, bugsOpen, bugsClosed, bugsDormant });
  } catch (error) {
    next(error);
  }
});

sortBugsRouter.route('/app').get(async (req, res, next) => {
  try {
    const { dev, user_name } = req.dbUser;

    const rawBugs = dev
      ? await CRUDService.getAllDataByOrder(
          req.app.get('db'),
          TABLE_NAME,
          'updated_at',
        )
      : await CRUDService.getAllBySearch(
          req.app.get('db'),
          'user_name',
          user_name,
        );

    const rawAppBugs = { mainApp: [], seconsApp: [] };
    for (let i = 0; i < rawBugs.length; i++) {
      const thisBug = rawBugs[i];

      const links = await QueryService.grabBugLinkages(
        req.app.get('db'),
        thisBug.id,
      );

      thisBug.status = links.status_name;
      thisBug.app = links.app_name;
      thisBug.severity = links.level;

      switch (thisBug.app) {
        case 'main app':
          rawAppBugs.mainApp.push(thisBug);
          break;

        case 'second app':
          rawAppBugs.secondApp.push(thisBug);
          break;

        default:
          break;
      }
    }

    const mainApp = SerializeService.formatAll(
        rawAppBugs.mainApp,
        TABLE_NAME,
      ),
      secondApp = SerializeService.formatAll(
        rawAppBugs.secondApp,
        TABLE_NAME,
      );

    res.status(200).json({ appBugs: { mainApp, secondApp } });
  } catch (error) {
    next(error);
  }
});

sortBugsRouter.route('/severity/:app').get(async (req, res, next) => {
  try {
    const app = req.params.app.replace(/-/g, ' ');

    const rawBugs = await CRUDService.getAllDataByOrder(
      req.app.get('db'),
      TABLE_NAME,
      'updated_at',
    );

    const pending = [],
      high = [],
      medium = [],
      low = [];
    for (let i = 0; i < rawBugs.length; i++) {
      const thisBug = rawBugs[i];

      const links = await QueryService.grabBugLinkages(
        req.app.get('db'),
        thisBug.id,
      );

      if (links.app_name === app) {
        thisBug.status = links.status_name;
        thisBug.app = links.app_name;
        thisBug.severity = links.level;

        switch (thisBug.severity) {
          case 'pending':
            pending.push(thisBug);
            break;

          case 'high':
            high.push(thisBug);
            break;

          case 'medium':
            medium.push(thisBug);
            break;

          case 'low':
            low.push(thisBug);
            break;

          default:
            break;
        }
      }
    }

    const bugsPending = SerializeService.formatAll(
        pending,
        TABLE_NAME,
      ),
      bugsHigh = SerializeService.formatAll(high, TABLE_NAME),
      bugsMedium = SerializeService.formatAll(medium, TABLE_NAME),
      bugsLow = SerializeService.formatAll(low, TABLE_NAME);

    res
      .status(200)
      .json({ bugsPending, bugsHigh, bugsMedium, bugsLow });
  } catch (error) {
    next(error);
  }
});

module.exports = sortBugsRouter;
