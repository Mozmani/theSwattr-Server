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

const TABLE_NAME = TABLE_NAMES.BUG;

const bugRouter = Router();

bugRouter.use(auth.requireAuth);

bugRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const { dev, user_name } = req.dbUser;

      const rawBugs = dev
        ? await CRUDService.getAllByOrder(
            req.app.get('db'),
            TABLE_NAME,
            'updated_at',
          )
        : await CRUDService.getAllBySearchOrder(
            req.app.get('db'),
            TABLE_NAME,
            'user_name',
            user_name,
            'updated_at',
          );

      if (!rawBugs.length) {
        res
          .status(400)
          .json({ error: `No bugs found for user: '${user_name}'` });
        return;
      }

      for (let i = 0; i < rawBugs.length; i++) {
        const thisBug = rawBugs[i];

        const links = await QueryService.grabBugLinkages(
          req.app.get('db'),
          thisBug.id,
        );

        thisBug.status = links.status_name;
        thisBug.app = links.app_name;
        thisBug.severity = links.level;
      }

      const bugs = SerializeService.formatAll(rawBugs, TABLE_NAME);

      res.status(200).json({ bugs });
    } catch (error) {
      next(error);
    }
  })
  .post(jsonBodyParser, validate.bugBody, async (req, res, next) => {
    try {
      const [rawBug] = await CRUDService.createEntry(
        req.app.get('db'),
        TABLE_NAME,
        req.newBug,
      );

      if (!rawBug) {
        res.status(400).json({ error: 'Invalid body credentials' });
        return;
      }

      await QueryService.initLinkages(
        req.app.get('db'),
        rawBug.id,
        req.appName,
      );

      rawBug.status = 'pending';
      rawBug.severity = 'pending';
      rawBug.app = req.appName;

      const newBug = SerializeService.formatBug(rawBug);

      res.status(200).json({ newBug });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  });

// ? Filter routes...
bugRouter.route('/user/:userName').get(async (req, res, next) => {
  try {
    const { userName } = req.params;
    const { dev, user_name } = req.dbUser;

    if (!dev && user_name !== userName) {
      res.status(401).json({ error: 'Unauthorized filter request' });
      return;
    }

    const filtBugs = await CRUDService.getAllBySearchOrder(
      req.app.get('db'),
      TABLE_NAME,
      'user_name',
      userName,
      'updated_at',
    );

    for (let i = 0; i < filtBugs.length; i++) {
      const thisBug = filtBugs[i];

      const links = await QueryService.grabBugLinkages(
        req.app.get('db'),
        thisBug.id,
      );

      thisBug.status = links.status_name;
      thisBug.app = links.app_name;
      thisBug.severity = links.level;
    }

    const userBugs = filtBugs.length
      ? SerializeService.formatAll(filtBugs, TABLE_NAME)
      : [{ message: `No bugs found for user: '${userName}'` }];

    res.status(200).json({ userBugs });
  } catch (error) {
    next(error);
  }
});

bugRouter.route('/app/:app').get(async (req, res, next) => {
  try {
    const app = req.params.app.replace(/-/g, ' ');
    const { dev, user_name } = req.dbUser;

    const rawBugs = dev
      ? await CRUDService.getAllByOrder(
          req.app.get('db'),
          TABLE_NAME,
          'updated_at',
        )
      : await CRUDService.getAllBySearchOrder(
          req.app.get('db'),
          TABLE_NAME,
          'user_name',
          user_name,
          'updated_at',
        );

    const filtBugs = [];
    for (let i = 0; i < rawBugs.length; i++) {
      const thisBug = rawBugs[i];

      const links = await QueryService.grabBugLinkages(
        req.app.get('db'),
        thisBug.id,
      );

      if (links.app === app) {
        thisBug.status = links.status_name;
        thisBug.app = links.app_name;
        thisBug.severity = links.level;

        filtBugs.push(thisBug);
      }
    }

    const appBugs = filtBugs.length
      ? SerializeService.formatAll(filtBugs, TABLE_NAME)
      : [{ message: `Wow! No bugs found for app: '${app}'` }];

    res.status(200).json({ appBugs });
  } catch (error) {
    next(error);
  }
});

bugRouter.route('/status/:status').get(async (req, res, next) => {
  try {
    const { status } = req.params;
    const { dev, user_name } = req.dbUser;

    const rawBugs = dev
      ? await CRUDService.getAllByOrder(
          req.app.get('db'),
          TABLE_NAME,
          'updated_at',
        )
      : await CRUDService.getAllBySearchOrder(
          req.app.get('db'),
          TABLE_NAME,
          'user_name',
          user_name,
          'updated_at',
        );

    const filtBugs = [];
    for (let i = 0; i < rawBugs.length; i++) {
      const thisBug = rawBugs[i];

      const links = await QueryService.grabBugLinkages(
        req.app.get('db'),
        thisBug.id,
      );

      if (links.status === status) {
        thisBug.status = links.status_name;
        thisBug.app = links.app_name;
        thisBug.severity = links.level;

        filtBugs.push(thisBug);
      }
    }

    const statBugs = filtBugs.length
      ? SerializeService.formatAll(filtBugs, TABLE_NAME)
      : [{ message: `No bugs found with status: '${status}'` }];

    res.status(200).json({ statBugs });
  } catch (error) {
    next(error);
  }
});

bugRouter.route('/severity/:level').get(async (req, res, next) => {
  try {
    const { level } = req.params;
    const { dev, user_name } = req.dbUser;

    const rawBugs = dev
      ? await CRUDService.getAllByOrder(
          req.app.get('db'),
          TABLE_NAME,
          'updated_at',
        )
      : await CRUDService.getAllBySearchOrder(
          req.app.get('db'),
          TABLE_NAME,
          'user_name',
          user_name,
          'updated_at',
        );

    const filtBugs = [];
    for (let i = 0; i < rawBugs.length; i++) {
      const thisBug = rawBugs[i];

      const links = await QueryService.grabBugLinkages(
        req.app.get('db'),
        thisBug.id,
      );

      if (links.level === level) {
        thisBug.status = links.status_name;
        thisBug.app = links.app_name;
        thisBug.severity = links.level;

        filtBugs.push(thisBug);
      }
    }

    const bugs = filtBugs.length
      ? SerializeService.formatAll(filtBugs, TABLE_NAME)
      : [{ message: `No bugs found with severity: '${level}'` }];

    res.status(200).json({ bugs });
  } catch (error) {
    next(error);
  }
});

bugRouter.route('/:id').get(async (req, res, next) => {
  try {
    const { id } = req.params;
    const { dev, user_name } = req.dbUser;

    const rawBug = await CRUDService.getBySearch(
      req.app.get('db'),
      TABLE_NAME,
      'id',
      id,
    );

    if (!dev && rawBug.user_name !== user_name) {
      res.status(401).json({ error: 'Unauthorized bug ID request' });
      return;
    }

    const links = await QueryService.grabBugLinkages(
      req.app.get('db'),
      rawBug.id,
    );

    rawBug.status = links.status_name;
    rawBug.app = links.app_name;
    rawBug.severity = links.level;

    const editBug = SerializeService.formatBug(rawBug);

    res.status(200).json(editBug);
  } catch (error) {
    next(error);
  }
});

module.exports = bugRouter;
