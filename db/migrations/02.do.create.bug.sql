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

DROP TABLE IF EXISTS bug;

CREATE TABLE bug (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bug_name VARCHAR(50) NOT NULL,
  description VARCHAR(5000) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  completed_notes VARCHAR(5000),
  app_name VARCHAR(50) NOT NULL DEFAULT 'main-app',
  severity VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING'
);

-- STILL NEEDS TESTING!

-- this will auto stamp updated_at on every table row update
-- CREATE TRIGGER bug_updated_at
-- BEFORE INSERT OR UPDATE OR DELETE ON comment_thread
-- FOR EACH ROW EXECUTE FUNCTION trigger_bug_updated_at();