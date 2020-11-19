const path = require('path');

const { TABLE_NAMES } = require('../constants/db.constants');
const {
  auth,
  validate,
  Router,
  jsonBodyParser,
} = require('../middlewares');
const {
  CRUDService,
  QueryService,
  SerializeService,
} = require('../services');

const usersRouter = Router();
const TABLE_NAME = TABLE_NAMES.USERS;

usersRouter.use(jsonBodyParser);

usersRouter.route('/').get(async (req, res, next) => {
  try {
    const allUsers = await CRUDService.getAllData(
      req.app.get('db'),
      TABLE_NAME,
    );
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
});

usersRouter
  .route('/login')
  .all(validate.loginBody, async (req, res, next) => {
    try {
      const dbUser = await CRUDService.getBySearch(
        req.app.get('db'),
        TABLE_NAME,
        'user_name',
        req.loginUser.user_name,
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
      const user = SerializeService.formatUser(req.dbUser);

      res.send({ user, authToken: req.token });
    } catch (error) {
      next(error);
    }
  });

usersRouter
  .route('/register')
  .post(validate.registrationBody, async (req, res, next) => {
    try {
      const invalidName = await QueryService.userNameExists(
        req.app.get('db'),
        req.newUser.user_name,
      );
      if (invalidName) {
        res.status(400).json({ error: `Username already taken` });
        return;
      }

      const { password } = req.newUser;
      req.newUser.password = await auth.hashPassword(password);

      const [newDbUser] = await CRUDService.createEntry(
        req.app.get('db'),
        TABLE_NAME,
        req.newUser,
      );

      const token = auth.createJwt(newDbUser.user_name, newDbUser.id);
      const user = SerializeService.formatUser(newDbUser);

      res
        .status(201)
        .location(
          path.posix.join(req.originalUrl, `/${user.userName}`),
        )
        .json({ user, authToken: token });
    } catch (error) {
      next(error);
    }
  });

module.exports = usersRouter;
