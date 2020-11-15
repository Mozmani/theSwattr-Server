const TABLE_NAMES = {
  BUG: 'bug',
  COMMENT_THREAD: 'comment_thread',
  USERS: 'users',
  APP: 'app',
  STATUS: 'status',
  SEVERITY_LEVEL: 'severity_level',
};

const BUG_TABLE = [
  'id',
  'user_id',
  'bug_name',
  'description',
  'created_at',
  'updated_at',
  'completed_at',
  'completed_notes',
  'app_name',
  'severity',
];

const COMMENT_THREAD_TABLE = [
  'bug_id',
  'user_id',
  'created_at',
  'comment',
];

const USERS_TABLE = [
  'id',
  'first_name',
  'last_name',
  'user_name',
  'password',
  'email',
  'dev',
];

const APP_TABLE = ['id', 'app_name'];

const BUG_STATUS_TABLE = ['id', 'status'];

const BUG_SEVERITY_LEVEL_TABLE = ['id', 'level'];

module.exports = {
  TABLE_NAMES,
  BUG_TABLE,
  COMMENT_THREAD_TABLE,
  USERS_TABLE,
  APP_TABLE,
  BUG_STATUS_TABLE,
  BUG_SEVERITY_LEVEL_TABLE,
};
