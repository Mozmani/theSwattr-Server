const CRUDService = require('../services/crud.service');
const {
  auth,
  validate,
  Router,
  jsonBodyParser
} = require('../../src/middlewares');

const userRouter = Router();
const TABLE_NAME = 'users'

userRouter
  .route('/login')
  .all(jsonBodyParser, validate.loginBody)
  .get((req, res, next) =>
    CRUDService.getByName(req.app.get('db'), TABLE_NAME, res.loginUser.user_name)
      .then((dbUser) => {
        if (!dbUser) {
          return res.status(400).json({ error: `Incorrect 'User Name'` });
        }

        res.dbUser = dbUser;
        return next();
      })
      .catch(next)
  )
  .get(auth.passwordCheck)

  .post(auth.hashPassword, (req, res, next) =>
    CRUDService.createEntry(req.app.get('db'), res.loginUser)
      .then((newUser) => {
        const { user_name, id } = newUser;

        const token = auth.createJwtService(user_name, id);
        return token;
      })
      .then((token) => res.json({ authToken: token }))
      .catch(next)
  );

module.exports = userRouter;
