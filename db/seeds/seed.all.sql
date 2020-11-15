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
  ('first', 'last', 'admin', 'pass', 'email', true);

INSERT INTO bug
  (
    user_id,
    bug_name,
    description
  )
VALUES
  (1, 'bug_name', 'decription');

INSERT INTO comment_thread
  (
    bug_id,
    user_id,
    comment
  )
VALUES
  (1, 1, 'comment');

COMMIT;