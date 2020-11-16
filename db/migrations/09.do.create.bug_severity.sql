DROP TABLE IF EXISTS bug_severity_level;

CREATE TABLE bug_severity_level (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  severity_id INTEGER REFERENCES severity_level(id) ON DELETE CASCADE,
  PRIMARY KEY (bug_id, severity_id)
);
