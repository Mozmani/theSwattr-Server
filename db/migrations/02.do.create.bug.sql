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
  severity VARCHAR(50) NOT NULL DEFAULT 'Low',
  status VARCHAR(50) NOT NULL DEFAULT 'Pending'
);

-- function for setting pending status
CREATE OR REPLACE FUNCTION trigger_bug_pending()
RETURNS TRIGGER AS $bug_pending$
  BEGIN
    -- update timestamp by id
    INSERT INTO bug_status (bug_id, status_id)
    VALUES (NEW.id, 1);
    RETURN NULL;
  END;
$bug_pending$ LANGUAGE plpgsql;

-- this will auto stamp updated_at on every comment update
CREATE TRIGGER bug_pending
AFTER INSERT ON bug
FOR EACH ROW EXECUTE FUNCTION trigger_bug_pending();