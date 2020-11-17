const {
  CRUDService,
  SerializeService,
} = require('../../src/services');
const UserService = require('../services/user-service')

const { TABLE_NAMES } = require('../../src/constants/db.constants');
const {
  auth,
  validate,
  Router,
  jsonBodyParser,
} = require('../../src/middlewares');
const path = require ('path');
const usersRouter = Router();
const TABLE_NAME = TABLE_NAMES.USERS;


usersRouter
.route('/')
// grabs userName / id from Users DB
.get((req, res, next) => {
  UserService.getAllUsers(req.app.get('db'))
    .then(users => {
      res.json(users);
    })
    .catch(next);
})
// adds a user to users DB - Registration
.post(jsonBodyParser, (req, res, next) => {
  const { password, user_name, first_name, last_name, email } = req.body;

  // makes sure entry consists of a user name and password
  for (const field of ['user_name', 'password', 'first_name', 'last_name', 'email'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`
      });

  // makes sure password meets required fields (over 8 chars, 1 capital, 1 number, 1 special char)
  const passwordError = UserService.validatePassword(password);
  const emailError = UserService.validateEmail(email)
  
  if(emailError)
      return res.status(400).json({error: emailError})

  if (passwordError)
    return res.status(400).json({ error: passwordError });
  // Makes sure new username is unique
  UserService.hasUserWithUserName(
    req.app.get('db'),
    user_name
  )
    .then(hasUserWithUserName => {
      if (hasUserWithUserName)
        return res.status(400).json({ error: `Username already taken` });

      // hashes password for db entry
      return UserService.hashPassword(password)
        .then(hashedPassword => {
          const newUser = {
            user_name,
            password: hashedPassword,
            first_name,
            last_name,
            email,
            dev: false,
          };
          // inserts new user data with hashed pw into users db
          return UserService.insertUser(
            req.app.get('db'),
            newUser
          )
            .then(user => {
              res
                .status(201)
                .location(path.posix.join(req.originalUrl, `/${user.id}`))
                .json(UserService.serializeUser(user));
            });
        });
    })
    .catch(next);
  
  
  
});



module.exports = usersRouter;
