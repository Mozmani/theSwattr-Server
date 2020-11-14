-- function for updating the updated_at column
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;

$$ LANGUAGE plpgsql;

DROP TABLE IF EXISTS bug;

CREATE TABLE bug (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES user_data(id) ON DELETE CASCADE,
  bug_name VARCHAR(50) NOT NULL,
  description VARCHAR(5000) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  completed_notes VARCHAR(5000),
  app_name VARCHAR(50) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL
);

-- this will auto stamp updated_at on every table row update
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON bug
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();