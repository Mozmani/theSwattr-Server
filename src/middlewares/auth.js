const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET, SALT_ROUNDS } = require('../config');
const { TABLE_NAMES } = require('../constants/db.constants');
const { CRUDService } = require('../services');

const createJwt = (user_name, email, firstName, lastName) => {
  const subject = user_name;
  const payload = { email, firstName, lastName };

  return jwt.sign(payload, JWT_SECRET, {
    subject,
    algorithm: 'HS256',
  });
};

const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (error) {
    return error;
  }
};

const passwordCheck = async (req, res, next) => {
  try {
    const plaintextPassword = req.loginUser.password;
    const {
      password,
      user_name,
      email,
      first_name,
      last_name,
    } = req.dbUser;

    const passwordsMatch = await bcrypt.compare(
      plaintextPassword,
      password,
    );

    if (!passwordsMatch) {
      res
        .status(401)
        .json({ error: 'Incorrect username or password' });
      return;
    }

    const token = createJwt(user_name, email, first_name, last_name);

    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

const requireAuth = async (req, res, next) => {
  const authToken = req.get('Authorization') || '';

  if (!authToken.toLowerCase().startsWith('bearer ')) {
    res.status(401).json({ error: 'Missing bearer token' });
    return;
  }
  const token = authToken.split(' ')[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });

    let dbUser;
    if (payload.sub) {
      dbUser = await CRUDService.getBySearch(
        req.app.get('db'),
        TABLE_NAMES.USERS,
        'user_name',
        payload.sub,
      );
    }

    if (!dbUser) {
      res.status(404).json({ message: 'Data not found' });
      return;
    }

    req.dbUser = dbUser;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createJwt,
  passwordCheck,
  hashPassword,
  requireAuth,
};
