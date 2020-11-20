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

usersRouter.use(jsonBodyParser);

usersRouter.route('/').get(async (req, res, next) => {
  try {
    const allUsers = await CRUDService.getAllDataByOrder(
      req.app.get('db'),
      TABLE_NAME,
      'dev',
      'desc',
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

      const token = auth.createJwt(
        newDbUser.user_name,
        newDbUser.email,
        newDbUser.first_name,
        newDbUser.last_name,
      );

      res.status(201).json({ authToken: token });
    } catch (error) {
      next(error);
    }
  });

module.exports = usersRouter;
