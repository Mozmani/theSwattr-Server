// Use this file for advanced queries/table joins
const QueryService = {
  userNameExists(db, user_name) {
    return db('users')
      .where({ user_name })
      .first()
      .then((user) => !!user);
  },

  initLinkages(db, bug_id, app) {
    return db.raw(`SELECT init_app_severity(${bug_id}, '${app}')`);
  },

  async grabBugLinkages(db, bug_id) {
    const [{ status_name }] = await db('status as s')
      .join('bug_status as bs', 'bs.status_id', 's.id')
      .select('status_name')
      .where({ bug_id });

    const [{ app_name }] = await db('app as a')
      .join('bug_app as ba', 'ba.app_id', 'a.id')
      .select('app_name')
      .where({ bug_id });

    const [{ level }] = await db('severity_level as sl')
      .join('bug_severity_level as bsl', 'bsl.severity_id', 'sl.id')
      .select('level')
      .where({ bug_id });

    return { status_name, app_name, level };
  },
};

module.exports = QueryService;
