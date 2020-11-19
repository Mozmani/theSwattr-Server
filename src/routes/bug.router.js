const { TABLE_NAMES } = require("../constants/db.constants");
const { CRUDService, QueryService, SerializeService } = require("../services");
const { auth, validate, Router, jsonBodyParser } = require("../middlewares");

const bugRouter = Router();
const TABLE_NAME = TABLE_NAMES.BUG;

bugRouter.use(auth.requireAuth);

bugRouter.route("/").get(async (req, res, next) => {
  try {
    const bugs = await CRUDService.getAllData(req.app.get("db"), TABLE_NAME);

    let theDb = req.app.get("db");
    for (let i = 0; i < bugs.length; i++) {
      let thisBug = bugs[i];
      thisBug.status = await QueryService.grabStatus(theDb, thisBug.id);
      thisBug.severity = await QueryService.grabSeverity(theDb, thisBug.id);
      thisBug.app = await QueryService.grabAppName(theDb, thisBug.id);
    }

    res.status(200).json({ bugs });
  } catch (error) {
    next(error);
  }
});
bugRouter
  .route("/:app")
  .post(jsonBodyParser, validate.bugBody, async (req, res, next) => {
    try {
      let { app } = req.params;

      app = app.replace(/-/g, " ");
      const [newBug] = await CRUDService.createEntry(
        req.app.get("db"),
        TABLE_NAME,
        req.newBug
      );

      await QueryService.initLinkages(req.app.get("db"), newBug.id, app);

      newBug.status = "pending";
      newBug.severity = "pending";
      newBug.app = app;

      res.status(200).json();
    } catch (error) {
      next(error);
    }
  });
bugRouter.route("/:user_name").get(async (req, res, next) => {
  try {
    let { user_name } = req.params;
    const rawBugs = await QueryService.findUserBugs(
      req.app.get("db"),
      user_name
    );

    let theDb = req.app.get("db");
    for (let i = 0; i < rawBugs.length; i++) {
      let thisBug = rawBugs[i];
      thisBug.status = await QueryService.grabStatus(theDb, thisBug.id);
      thisBug.severity = await QueryService.grabSeverity(theDb, thisBug.id);
      thisBug.app = await QueryService.grabAppName(theDb, thisBug.id);
    }
    const bugs = SerializeService.formatAll(rawBugs, TABLE_NAME);

    res.status(200).json({ bugs });
  } catch (error) {
    next(error);
  }
});
bugRouter.route("/severity/:severity").get(async (req, res, next) => {
  try {
    let { severity } = req.params;
    let rawBugs = await CRUDService.getAllData(req.app.get("db"), TABLE_NAME);

    let theDb = req.app.get("db");
    let newBugs = [];
    for (let i = 0; i < rawBugs.length; i++) {
      let thisBug = rawBugs[i];
      thisBug.status = await QueryService.grabStatus(theDb, thisBug.id);
      thisBug.severity = await QueryService.grabSeverity(theDb, thisBug.id);
      thisBug.app = await QueryService.grabAppName(theDb, thisBug.id);
      if (thisBug.severity === severity) {
        newBugs.push(thisBug);
      }
    }

    const bugs = SerializeService.formatAll(newBugs, TABLE_NAME);

    res.status(200).json({ bugs });
  } catch (error) {
    next(error);
  }
});
// bugRouter.route("/edit/:bugId").get(async (req, res, next) => {
//   try {
//     let { bugId } = req.params;
//     const rawBugs = await CRUDService.getBySearch(
//       req.app.get("db"),
//       TABLE_NAME,
//       'bug_id',
//       bugId
//     );

//     // let theDb = req.app.get("db");
//     // for (let i = 0; i < rawBugs.length; i++) {
//     //   let thisBug = rawBugs[i];
//     //   thisBug.status = await QueryService.grabStatus(theDb, thisBug.id);
//     //   thisBug.severity = await QueryService.grabSeverity(theDb, thisBug.id);
//     //   thisBug.app = await QueryService.grabAppName(theDb, thisBug.id);
//     // }
//     // const bugs = SerializeService.formatAll(rawBugs, TABLE_NAME);

//     res.status(200).json({ rawBugs });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = bugRouter;
