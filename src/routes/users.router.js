const { TABLE_NAMES } = require('../constants/db.constants');
const { CRUDService, QueryService } = require('../services');
const {
  auth,
  validate,
  Router,
  jsonBodyParser,
} = require('../middlewares');

const usersRouter = Router();
const TABLE_NAME = TABLE_NAMES.USERS;

usersRouter
  .route('/')
  .get(auth.requireAuth, async (req, res, next) => {
    try {
      if (!req.dbUser.dev) {
        res.status(401).json({ error: `Unauthorized request` });
        return;
      }

      const allUsers = await CRUDService.getAllByOrder(
        req.app.get('db'),
        TABLE_NAME,
        'dev',
        'desc',
      );

      res.status(200).json({ allUsers });
    } catch (error) {
      next(error);
    }
  });

usersRouter
  .route('/token')
  .get(auth.requireAuth, async (req, res, next) => {
    try {
      const authToken = auth.createJwt(req.dbUser);

      res.status(200).json({ authToken });
    } catch (error) {
      next(error);
    }
  });

usersRouter
  .route('/login')
  .all(jsonBodyParser, validate.loginBody, async (req, res, next) => {
    try {
      const dbUser = await CRUDService.getBySearch(
        req.app.get('db'),
        TABLE_NAME,
        'user_name',
        req.body.user_name,
      );

      if (!dbUser) {
        res.status(400).json({
          error: 'Incorrect username or password',
        });
        return;
      }

      req.dbUser = dbUser;
      next();
    } catch (error) {
      next(error);
    }
  })
  .post(auth.passwordCheck, (req, res, next) => {
    try {
      res.send({ authToken: req.token });
    } catch (error) {
      next(error);
    }
  });

usersRouter
  .route('/register')
  .all(jsonBodyParser, validate.registrationBody)
  .post(async (req, res, next) => {
    try {
      const invalidName = await QueryService.userNameExists(
        req.app.get('db'),
        req.newUser.user_name,
      );

      if (invalidName) {
        res.status(401).json({ error: `Invalid username` });
        return;
      }

      const { password } = req.newUser;
      req.newUser.password = await auth.hashPassword(password);

      const [newDbUser] = await CRUDService.createEntry(
        req.app.get('db'),
        TABLE_NAME,
        req.newUser,
      );

      const token = auth.createJwt(newDbUser);

      res.status(201).json({ authToken: token });
    } catch (error) {
      next(error);
    }
  });

usersRouter
  .route('/dev/:userName')
  .all(auth.requireAuth, jsonBodyParser, validate.devBody)
  .patch(async (req, res, next) => {
    try {
      const { user_name, dev } = req.dbUser;

      await CRUDService.updateDevField(
        req.app.get('db'),
        user_name,
        !dev,
      );

      res.status(201).json({ devStat: !dev });
    } catch (error) {
      next(error);
    }
  });

module.exports = usersRouter;
