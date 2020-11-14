export const TABLE_NAMES = {
  BUG: 'bug',
  COMMENT_THREAD: 'comment_thread',
  USERS: 'users',
  APP: 'app',
  STATUS: 'status',
  SEVERITY_LEVEL: 'severity_level'
};

export const BUG_TABLE = [
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

export const COMMENT_THREAD_TABLE = [
  'bug_id',
  'user_id',
  'created_at',
  'comment',
];

export const USERS_TABLE = [
  'id',
  'first_name',
  'last_name',
  'user_name',
  'password',
  'email',
  'dev',
];

export const APP_TABLE = ['id', 'app_name'];

export const BUG_STATUS_TABLE = ['id', 'status'];

export const BUG_SEVERITY_LEVEL_TABLE = ['id', 'level'];
