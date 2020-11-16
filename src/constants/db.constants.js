const TABLE_NAMES = {
  USERS: 'users',
  BUG: 'bug',
  COMMENT_THREAD: 'comment_thread',
  STATUS: 'status',
  APP: 'app',
  SEVERITY_LEVEL: 'severity_level',
  BUG_STATUS: 'bug_status',
  BUG_APP: 'bug_app',
  BUG_SEVERITY: 'bug_severity',
};

const USERS_TABLE = [
  'id',
  'first_name',
  'last_name',
  'user_name',
  'password',
  'email',
  'dev',
];

const BUG_TABLE = [
  'id',
  'user_id',
  'bug_name',
  'description',
  'created_at',
  'updated_at',
  'completed_at',
  'completed_notes',
];

const COMMENT_THREAD_TABLE = [
  'id',
  'bug_id',
  'user_id',
  'created_at',
  'comment',
];

const STATUS_TABLE = ['id', 'status_name'];

const APP_TABLE = ['id', 'app_name'];

const SEVERITY_LEVEL_TABLE = ['id', 'level'];

const BUG_STATUS_TABLE = ['bug_id', 'status_id'];

const BUG_APP_TABLE = ['bug_id', 'app_id'];

const BUG_SEVERITY_TABLE = ['bug_id', 'severity_id'];

module.exports = {
  TABLE_NAMES,
  USERS_TABLE,
  BUG_TABLE,
  COMMENT_THREAD_TABLE,
  STATUS_TABLE,
  APP_TABLE,
  SEVERITY_LEVEL_TABLE,
  BUG_STATUS_TABLE,
  BUG_APP_TABLE,
  BUG_SEVERITY_TABLE,
};
