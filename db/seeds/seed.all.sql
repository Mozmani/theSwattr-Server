BEGIN;

TRUNCATE users RESTART IDENTITY CASCADE;

INSERT INTO users
  (
    first_name,
    last_name,
    user_name,
    password,
    email,
    dev
  )
VALUES
  ('John', 'Smith', 'admin', 'pass', 'email@yoohoo.com', true),
  ('Jane', 'Austin', 'user', 'pass', 'user@yoohoo.com', false);

INSERT INTO bug
  (
    user_id,
    bug_name,
    description
  )
VALUES
  (1, 'Bug 1', 'decription of Bug 1'),
  (2, 'Bug 2', 'decription of Bug 2');

INSERT INTO comment_thread
  (
    bug_id,
    user_id,
    comment
  )
VALUES
  (1, 1, 'dev comment 1'),
  (2, 1, 'dev response 1'),
  (2, 2, 'user response 1'),
  (2, 1, 'dev response 2'),
  (1, 1, 'dev comment 1');

COMMIT;