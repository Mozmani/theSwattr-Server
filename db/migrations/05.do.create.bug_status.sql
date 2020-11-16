DROP TABLE IF EXISTS bug_status;

CREATE TABLE bug_status (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  status_id INTEGER REFERENCES status(id) ON DELETE CASCADE,
  PRIMARY KEY (bug_id, status_id)
);
