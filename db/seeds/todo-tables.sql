-- linkage
CREATE TABLE bug_app (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  app_id INTEGER REFERENCES app(id) ON DELETE CASCADE,
  PRIMARY KEY (bug_id, app_id)
);
CREATE TABLE app (
  id SERIAL NOT NULL PRIMARY KEY,
  app_name VARCHAR(50),
);

-- linkage
CREATE TABLE bug_status (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  status_id INTEGER REFERENCES status(id) ON DELETE CASCADE,
  PRIMARY KEY (bug_id, status_id)
);
CREATE TABLE status (
  id SERIAL NOT NULL PRIMARY KEY,
  status VARCHAR(10),
);

-- linkage
CREATE TABLE bug_severity_level (
  bug_id INTEGER REFERENCES bug(id) ON DELETE CASCADE,
  severity_id INTEGER REFERENCES severity_level(id) ON DELETE CASCADE,
  PRIMARY KEY (bug_id, severity_id)
);
CREATE TABLE severity_level (
  id SERIAL NOT NULL PRIMARY KEY,
  level VARCHAR(50),
);