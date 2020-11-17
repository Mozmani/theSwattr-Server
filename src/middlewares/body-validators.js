const { SerializeService, CRUDService } = require('../services');

const ValidationMethods = {
  checkFields(rawObject) {
    const keyVals = Object.entries(rawObject);

    const undefField = keyVals.find(
      ([, value]) => value === undefined,
    );

    return undefField ? undefField[0] : null;
  },

  errorResponse(res, undefField) {
    res.status(400).json({
      error: `Missing '${undefField}' in request body`,
    });
  },
};

const registrationBody = (req, res, next) => {
  const rawUser = ({
    first_name,
    last_name,
    user_name,
    password,
    email,
  } = req.body);

  //? for testing only
  if (req.body.id) {
    rawUser.id = req.body.id;
  }

  const undefField = ValidationMethods.checkFields(rawUser);
  if (undefField) {
    return ValidationMethods.errorResponse(res, undefField);
  }

  const newUser = SerializeService.serializeObject(rawUser);

  req.newUser = newUser;
  next();
};

const loginBody = (req, res, next) => {
  const rawLogin = ({ user_name, password } = req.body);

  const undefField = ValidationMethods.checkFields(rawLogin);
  if (undefField) {
    return ValidationMethods.errorResponse(res, undefField);
  }

  const loginUser = SerializeService.serializeObject(rawLogin);

  req.loginUser = loginUser;
  next();
};

const bugBody = (req, res, next) => {
  const rawBug = ({
    bug_name,
    description,
    app,
    severity,
  } = req.body);

  const { user_name } = req.body;
  if (!user_name) {
    return ValidationMethods.errorResponse(res, 'user_name');
  } else {
    rawBug.user_id = { id } = CRUDService.getByName(
      req.app.get('db'),
      user_name,
    );
  }

  //? for testing only
  if (req.body.id) {
    rawBug.id = req.body.id;
  }

  const undefField = ValidationMethods.checkFields(rawBug);
  if (undefField) {
    return ValidationMethods.errorResponse(res, undefField);
  }

  const newBug = SerializeService.serializeObject(rawBug);

  req.newBug = newBug;
  next();
};

const commentBody = (req, res, next) => {
  const rawComment = ({ bug_id, comment } = req.body);

  const { user_name } = req.body;
  if (!user_name) {
    return ValidationMethods.errorResponse(res, 'user_name');
  } else {
    rawComment.user_id = { id } = CRUDService.getByName(
      req.app.get('db'),
      user_name,
    );
  }

  //? for testing only
  if (req.body.id) {
    rawComment.id = req.body.id;
  }

  const undefField = ValidationMethods.checkFields(rawComment);
  if (undefField) {
    return ValidationMethods.errorResponse(res, undefField);
  }

  const newComment = SerializeService.serializeObject(rawComment);

  req.newComment = newComment;
  next();
};

module.exports = {
  registrationBody,
  loginBody,
  bugBody,
  commentBody,
};
