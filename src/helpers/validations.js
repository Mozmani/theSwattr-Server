// eslint-disable-next-line no-useless-escape
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const checkFields = (rawObject) => {
  const keyVals = Object.entries(rawObject);

  const undefField = keyVals.find(([, value]) => value === undefined);

  return undefField ? undefField[0] : null;
};

const validateEmail = (email) => {
  if (email.length < 5) {
    return 'email must be longer than 4 characters';
  }

  if (!EMAIL_REGEX.test(email)) {
    return 'You must use a valid email!';
  }

  return null;
};

const validatePassword = (password) => {
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
};

module.exports = {
  checkFields,
  validateEmail,
  validatePassword,
};
