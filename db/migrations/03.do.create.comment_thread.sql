DROP TABLE IF EXISTS comment_thread;

CREATE TABLE comment_thread (
  id SERIAL PRIMARY KEY,
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  comment VARCHAR(2000) NOT NULL
);

-- function for updating the updated_at column in bug table
CREATE OR REPLACE FUNCTION trigger_bug_updated_at()
RETURNS TRIGGER AS $bug_updated_at$
BEGIN
  -- basic checks
  IF NEW.bug_id IS NULL THEN
    RAISE EXCEPTION 'bug_id cannot be null';
  END IF;
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null';
  END IF;
  IF NEW.comment IS NULL THEN
    RAISE EXCEPTION 'comment cannot be null';
  END IF;

  -- update timestamp by id
  UPDATE bug SET updated_at = NOW()
  WHERE id = NEW.bug_id;
  RETURN NEW;
END;

$bug_updated_at$ LANGUAGE plpgsql;

-- this will auto stamp updated_at on every comment update
CREATE TRIGGER bug_updated_at
BEFORE INSERT OR UPDATE OR DELETE ON comment_thread
FOR EACH ROW EXECUTE FUNCTION trigger_bug_updated_at();