BEGIN;

TRUNCATE users, status, app, severity_level RESTART IDENTITY CASCADE;

-- start with base tables for linkages
INSERT INTO status (status_name)
VALUES
  ('pending'),
  ('open'),
  ('closed'),
  ('dormant');

INSERT INTO app (app_name)
VALUES
  ('main-app'),
  ('second-app');

INSERT INTO severity_level (level)
VALUES
  ('low'),
  ('medium'),
  ('high'),
  ('pending');

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
  -- admin password: 'pass'
  ('John', 'Smith', 'admin', '$2a$05$8AUgiI2oqtTwrY5zTZIbq.TVHfKYcTOdXnny6Yfuu3MKIQTzPQDLK', 'email@yoohoo.com', true),
  ('Jane', 'Austin', 'user2', 'pass', 'user@yoohoo.com', false);

INSERT INTO bug
  (
    user_name,
    bug_name,
    description
  )
VALUES
  ('admin', 'Bug 1', 'decription of Bug 1'),
  ('user2', 'Bug 2', 'decription of Bug 2');

-- functions to seed linkage tables
SELECT init_app_severity(1, 'main-app');
SELECT init_app_severity(2, 'second-app');

SELECT update_bug_severity(1, 'high');

INSERT INTO comment_thread
  (
    bug_id,
    user_name,
    comment
  )
VALUES
  (1, 'admin', 'dev comment 1'),
  (2, 'admin', 'dev response 1'),
  (2, 'user2', 'user response 1'),
  (2, 'admin', 'dev response 2'),
  (1, 'admin', 'dev comment 2');

COMMIT;