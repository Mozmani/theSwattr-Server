// Use this file for advanced queries/table joins
const QueryService = {
  // ? makes sure new username is unique
  userNameExists(db, user_name) {
    return db("users")
      .where({ user_name })
      .first()
      .then((user) => !!user);
  },
  findUserBugs(db, user_name) {
    return db("bug").where({ user_name });
  },
  initLinkages(db, bug_id, app) {
    console.log(app)
    return db.raw(`SELECT init_app_severity(${bug_id}, '${app}')`);
  },
  async grabStatus(db, bug_id) {
    const status = await db.raw(`select status_name
    from  status s 
    join bug_status bs on bs.status_id = s.id 
    where bug_id = ${bug_id};`);

    return status.rows[0].status_name;
  },
  async grabAppName(db, bug_id) {
    const app = await db.raw(`select app_name
    from app a 
    join bug_app ba on ba.app_id = a.id 
    where bug_id = ${bug_id};`);

    return app.rows[0].app_name;
  },
  async grabSeverity(db, bug_id) {
    const severity = await db.raw(`select level
    from severity_level sl 
    join bug_severity_level bsl on bsl.severity_id = sl.id
    where bug_id = ${bug_id};`);

    return severity.rows[0].level;
  },
};

module.exports = QueryService;
