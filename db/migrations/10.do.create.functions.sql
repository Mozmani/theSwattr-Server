-- function for updating bug's app
CREATE OR REPLACE FUNCTION update_bug_app(new_bug_id INTEGER, app TEXT)
RETURNS VOID AS $update_bug_app$
  DECLARE
    bug_check       INTEGER;
    bugged_app      INTEGER;

  BEGIN
    -- validate and assign variables to ids
    SELECT id INTO bug_check
    FROM bug WHERE id = new_bug_id;

    IF bug_check IS NULL THEN
      RAISE EXCEPTION 'invalid bug id';
    END IF;

    CASE
      WHEN app = 'main app' THEN bugged_app = 1;
      ELSE RAISE EXCEPTION 'invalid app name';
    END CASE;

    -- insert linkage table
    INSERT INTO bug_app (bug_id, app_id)
    VALUES (new_bug_id, bugged_app);
  END;
$update_bug_app$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_bug_severity(new_bug_id INTEGER, severity TEXT)
RETURNS VOID AS $update_bug_severity$
  DECLARE
    bug_check       INTEGER;
    severity_level  INTEGER;

  BEGIN
    -- validate and assign variables to ids
    SELECT id INTO bug_check
    FROM bug WHERE id = new_bug_id;

    IF bug_check IS NULL THEN
      RAISE EXCEPTION 'invalid bug id';
    END IF;

    CASE
      WHEN severity = 'low'     THEN severity_level = 1;
      WHEN severity = 'medium'  THEN severity_level = 2;
      WHEN severity = 'high'    THEN severity_level = 3;
      ELSE RAISE EXCEPTION 'invalid severity level';
    END CASE;

    -- insert linkage table
    INSERT INTO bug_severity_level (bug_id, severity_id)
    VALUES (new_bug_id, severity_level);
  END;
$update_bug_severity$ LANGUAGE plpgsql;

-- function for initializing a bug's app and severity level
CREATE OR REPLACE FUNCTION init_app_severity(new_bug_id INTEGER, app TEXT, severity TEXT)
RETURNS VOID AS $$
  BEGIN
    PERFORM update_bug_app(new_bug_id, app);
    PERFORM update_bug_severity(new_bug_id, severity);
  END;
$$ LANGUAGE plpgsql;
