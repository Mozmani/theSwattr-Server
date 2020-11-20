const { DEV_SECRET } = require('../config');
const { SerializeService } = require('../services');
const {
  checkFields,
  validateEmail,
  validatePassword,
} = require('../helpers/validations');

function _errorResponse(res, undefField) {
  res.status(400).json({
    error: `Missing '${undefField}' in request body`,
  });
}

const loginBody = (req, res, next) => {
  const { user_name, password } = req.body;
  const rawLogin = { user_name, password };

  const undefField = checkFields(rawLogin);
  if (undefField) {
    _errorResponse(res, undefField);
    return;
  }

  const loginUser = SerializeService.sanitizeObject(rawLogin);

  req.loginUser = loginUser;
  next();
};

const registrationBody = async (req, res, next) => {
  const {
    first_name,
    last_name,
    user_name,
    password,
    email,
  } = req.body;

  const rawUser = {
    first_name,
    last_name,
    user_name,
    password,
    email,
  };

  // ? for testing only
  if (req.body.id) {
    rawUser.id = req.body.id;
  }

  const undefField = checkFields(rawUser);
  if (undefField) {
    _errorResponse(res, undefField);
    return;
  }

  const passError = validatePassword(rawUser.password);
  if (passError) {
    res.status(400).json({ error: passError });
    return;
  }

  const newUser = SerializeService.sanitizeObject(rawUser);

  const emailError = validateEmail(newUser.email);
  if (emailError) {
    res.status(400).json({ error: emailError });
    return;
  }

  req.newUser = newUser;
  next();
};

const devBody = (req, res, next) => {
  const { dev_secret } = req.body;

  if (!dev_secret) {
    _errorResponse(res, 'dev_secret');
    return;
  }

  if (dev_secret !== DEV_SECRET) {
    res.status(401).json({ error: `Invalid code` });
    return;
  }

  next();
};

const bugBody = async (req, res, next) => {
  const app = req.body.app.replace(/-/g, ' ');
  const {
    user_name,
    bug_name,
    description,
    completed_notes,
  } = req.body;

  const rawBug = { user_name, bug_name, description, app };

  // ? for testing only
  if (req.body.id) {
    rawBug.id = req.body.id;
  }

  const undefField = checkFields(rawBug);
  if (undefField) {
    _errorResponse(res, undefField);
    return;
  }

  if (completed_notes) {
    rawBug.completed_notes = completed_notes;
  }

  const newBug = SerializeService.sanitizeObject(rawBug);

  req.newBug = newBug;
  next();
};

const linkageBody = async (req, res, next) => {
  const { status, app, severity } = req.body;
  const rawLinks = { status, app, severity };

  const undefField = checkFields(rawLinks);
  if (undefField) {
    _errorResponse(res, undefField);
    return;
  }

  const links = SerializeService.sanitizeObject(rawLinks);

  req.links = links;
  next();
};

const commentBody = async (req, res, next) => {
  const { bug_id, user_name, comment } = req.body;
  const rawComment = { bug_id, user_name, comment };

  // ? for testing only
  if (req.body.id) {
    rawComment.id = req.body.id;
  }

  const undefField = checkFields(rawComment);
  if (undefField) {
    _errorResponse(res, undefField);
    return;
  }

  const newComment = SerializeService.sanitizeObject(rawComment);

  req.newComment = newComment;
  next();
};

module.exports = {
  registrationBody,
  loginBody,
  devBody,
  bugBody,
  linkageBody,
  commentBody,
};
