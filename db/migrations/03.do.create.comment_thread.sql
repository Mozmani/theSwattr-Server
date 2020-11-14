DROP TABLE IF EXISTS comment_thread;

CREATE TABLE comment_thread (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  comment VARCHAR(2000),
  PRIMARY KEY (bug_id, user_id)
);