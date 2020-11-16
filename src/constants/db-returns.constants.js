//? More for reference, these are the 'keys' in the objects that the server will return to the client
const USERS_RETURN = [
  'firstName',
  'lastName',
  'userName',
  'email',
  'dev',
];

const BUG_RETURN = [
  'id',
  'bugPostedBy',
  'bugName',
  'description',
  'createdDate',
  'updatedDate',
  'completedDate',
  'completedNotes',
  'status',
  'app',
  'severity',
];

const COMMENT_THREAD_RETURN = [
  'id',
  'bugName',
  'userName',
  'comment',
  'createdDate',
];

const BUG_STATUS_RETURN = [...BUG_RETURN];

const BUG_APP_RETURN = [...BUG_RETURN];

const BUG_SEVERITY_RETURN = [...BUG_RETURN];

module.exports = {
  USERS_RETURN,
  BUG_RETURN,
  COMMENT_THREAD_RETURN,
  BUG_STATUS_RETURN,
  BUG_APP_RETURN,
  BUG_SEVERITY_RETURN,
};
