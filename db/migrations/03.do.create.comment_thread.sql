DROP TABLE IF EXISTS comment_thread;

CREATE TABLE comment_thread (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  comment VARCHAR(2000) NOT NULL,
  PRIMARY KEY (bug_id, user_id)
);


-- STILL NEEDS TESTING!

-- this will auto stamp updated_at on every table row update
CREATE TRIGGER bug_updated_at
BEFORE INSERT OR UPDATE OR DELETE ON comment_thread
FOR EACH ROW EXECUTE FUNCTION trigger_bug_updated_at();