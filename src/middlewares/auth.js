const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET, JWT_EXPIRY, SALT_ROUNDS } = require('../config');
const { TABLE_NAMES } = require('../constants/db.constants');
const { CRUDService } = require('../services');

const createJwt = (user) => {
  const { user_name, email, first_name, last_name, dev } = user;

  const subject = user_name;
  const payload = {
    email,
    firstName: first_name,
    lastName: last_name,
    dev,
  };

  return jwt.sign(payload, JWT_SECRET, {
    subject,
    expiresIn: JWT_EXPIRY,
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
    const plainTextPassword = req.loginUser.password;
    const hashedPassword = req.dbUser.password;

    const passwordsMatch = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );

    if (!passwordsMatch) {
      res
        .status(401)
        .json({ error: 'Incorrect username or password' });
      return;
    }

    const token = createJwt(req.dbUser);

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
