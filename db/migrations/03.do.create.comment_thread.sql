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

-- function for updating status on bug linkage table
CREATE OR REPLACE FUNCTION trigger_bug_status()
RETURNS TRIGGER AS $bug_status$
  DECLARE
    current_status INTEGER;
  BEGIN
    -- grab current status
    SELECT status_id INTO current_status
    FROM bug_status WHERE bug_id = NEW.bug_id;

    -- check if bug is closed
    IF current_status = 2 THEN
      RETURN NULL;
    ELSEIF current_status = 3 THEN
      RAISE EXCEPTION 'bug is closed';
    END IF;

    -- update status by id to 'open'
    UPDATE bug_status SET status_id = 2
    WHERE bug_id = NEW.bug_id;
    RETURN NULL;
  END;
$bug_status$ LANGUAGE plpgsql;

-- this will auto update status if needed on comment update
CREATE TRIGGER bug_status
AFTER INSERT OR UPDATE OR DELETE ON comment_thread
FOR EACH ROW EXECUTE FUNCTION trigger_bug_status();