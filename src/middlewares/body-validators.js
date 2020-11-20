const { SerializeService } = require('../services');

// eslint-disable-next-line no-useless-escape
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function _checkFields(rawObject) {
  const keyVals = Object.entries(rawObject);

  const undefField = keyVals.find(([, value]) => value === undefined);

  return undefField ? undefField[0] : null;
}

function _errorResponse(res, undefField) {
  res.status(400).json({
    error: `Missing '${undefField}' in request body`,
  });
}

function _validateEmail(email) {
  if (email.length < 5) {
    return 'email must be longer than 4 characters';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'You must use a valid email!';
  }

  return null;
}

function _validatePassword(password) {
  if (password.length < 8) {
    return 'Password be longer than 8 characters';
  }

  if (password.length > 72) {
    return 'Password be less than 72 characters';
  }

  if (password.startsWith(' ') || password.endsWith(' ')) {
    return 'Password must not start or end with empty spaces';
  }

  if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
    return 'Password must contain one upper case, lower case, number and special character';
  }

  return null;
}

const loginBody = (req, res, next) => {
  const { user_name, password } = req.body;
  const rawLogin = { user_name, password };

  const undefField = _checkFields(rawLogin);
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

  const undefField = _checkFields(rawUser);
  if (undefField) {
    _errorResponse(res, undefField);
    return;
  }

  const passError = _validatePassword(rawUser.password);
  if (passError) {
    res.status(400).json({ error: passError });
    return;
  }

  const newUser = SerializeService.sanitizeObject(rawUser);

  const emailError = _validateEmail(newUser.email);
  if (emailError) {
    res.status(400).json({ error: emailError });
    return;
  }

  req.newUser = newUser;
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

  const undefField = _checkFields(rawBug);
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

  const undefField = _checkFields(rawLinks);
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

  const undefField = _checkFields(rawComment);
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
  bugBody,
  commentBody,
  linkageBody,
};
