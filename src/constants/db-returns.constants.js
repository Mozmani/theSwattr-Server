// ? More for reference, these are the 'keys' in the objects that the server will CLIENT_return to the client
const APP_CLIENT_RETURN = ['appName1', 'appName2', 'etc...'];

const USERS_CLIENT_RETURN = {
  firstName: 'first_name',
  lastName: 'last_name',
  userName: 'user_name',
  email: 'email',
  dev: 'dev',
};

const BUG_CLIENT_RETURN = {
  id: 'id',
  bugPostedBy: 'user_name',
  bugName: 'bug_name',
  description: 'description',
  createdDate: 'created_at',
  updatedDate: 'updated_at',
  completedDate: 'completed_at',
  completedNotes: 'completed_notes',
  status: 'status',
  app: 'app',
  severity: 'severity',
};

const COMMENT_THREAD_CLIENT_RETURN = {
  id: 'id',
  bugName: 'bug_name',
  userName: 'user_name',
  comment: 'comment',
  createdDate: 'created_at',
};

// const BUG_STATUS_CLIENT_RETURN = [...BUG_CLIENT_RETURN];

// const BUG_APP_CLIENT_RETURN = [...BUG_CLIENT_RETURN];

// const BUG_SEVERITY_CLIENT_RETURN = [...BUG_CLIENT_RETURN];

module.exports = {
  APP_CLIENT_RETURN,
  USERS_CLIENT_RETURN,
  BUG_CLIENT_RETURN,
  COMMENT_THREAD_CLIENT_RETURN,
  // BUG_STATUS_CLIENT_RETURN,
  // BUG_APP_CLIENT_RETURN,
  // BUG_SEVERITY_CLIENT_RETURN,
};
