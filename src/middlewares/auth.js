const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { JWT_SECRET, SALT_ROUNDS } = require('../config');

const createJwtService = (user_name, id) => {
  const subject = user_name;
  const payload = { user_id: id };

  return jwt.sign(payload, JWT_SECRET, {
    subject,
    algorithm: 'HS256'
  });
};

const passwordCheck = async (req, res, next) => {
  try {
    const plaintextPassword = req.body.password;
    const { password, user_name, id } = res.dbUser;

    const passwordsMatch = await bcrypt.compare(plaintextPassword, password);

    if (!passwordsMatch)
      return res.status(401).json({ error: 'Unauthorized request' });

    const token = createJwtService(user_name, id);
    return res.json({ authToken: token });
  } catch (error) {
    return next(error);
  }
};

const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    res.hashedPassword = hash;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { createJwtService, passwordCheck, hashPassword };
