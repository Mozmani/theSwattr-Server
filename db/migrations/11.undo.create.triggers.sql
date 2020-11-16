DROP TRIGGER IF EXISTS bug_status ON comment_thread;
DROP TRIGGER IF EXISTS bug_updated_at ON comment_thread;
DROP TRIGGER IF EXISTS bug_pending ON bug;
DROP FUNCTION IF EXISTS trigger_bug_status;
DROP FUNCTION IF EXISTS trigger_bug_updated_at;
DROP FUNCTION IF EXISTS trigger_bug_pending;
