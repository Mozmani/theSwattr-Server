const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET, SALT_ROUNDS } = require('../config');
const { CRUDService } = require('../services');

const createJwt = (user_name, id) => {
  const subject = user_name;
  const payload = { user_id: id };

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
    const { password, user_name, id } = req.dbUser;

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

    const token = createJwt(user_name, id);

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
      dbUser = await CRUDService.getByName(
        req.app.get('db'),
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
