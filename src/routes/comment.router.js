const { TABLE_NAMES } = require('../constants/db.constants');
const { CRUDService, SerializeService } = require('../services');
const {
  auth,
  validate,
  Router,
  jsonBodyParser,
} = require('../middlewares');

const commentRouter = Router();
const TABLE_NAME = TABLE_NAMES.COMMENT_THREAD;

async function _bugName(db, bug_id, dev, user_name) {
  const bug = await CRUDService.getBySearch(
    db,
    TABLE_NAMES.BUG,
    'id',
    bug_id,
  );

  if (dev || bug.user_name === user_name) {
    return bug.bug_name;
  }

  return null;
}

commentRouter.use(auth.requireAuth);

commentRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const { dev, user_name } = req.dbUser;

      const rawComments = dev
        ? await CRUDService.getAllByOrder(
            req.app.get('db'),
            TABLE_NAME,
            'created_at',
          )
        : await CRUDService.getAllBySearchOrder(
            req.app.get('db'),
            'user_name',
            user_name,
            'created_at',
          );

      for (let i = 0; i < rawComments.length; i++) {
        const { bug_id } = rawComments[i];
        rawComments[i].bug_name = await _bugName(
          req.app.get('db'),
          bug_id,
          dev,
          user_name,
        );
      }

      const comments = SerializeService.formatAll(
        rawComments,
        TABLE_NAME,
      );

      res.status(200).json({ comments });
    } catch (error) {
      next(error);
    }
  })
  .post(
    jsonBodyParser,
    validate.commentBody,
    async (req, res, next) => {
      try {
        const { dev, user_name } = req.dbUser;

        const bug_name = await _bugName(
          req.app.get('db'),
          req.newComment.bug_id,
          dev,
          user_name,
        );

        if (!bug_name) {
          res.status(401).json({
            error: 'Bug not found/unauthorized comment query',
          });
          return;
        }

        const [rawComment] = await CRUDService.createEntry(
          req.app.get('db'),
          TABLE_NAME,
          req.newComment,
        );

        rawComment.bug_name = bug_name;

        const newComment = SerializeService.formatComment(rawComment);

        res.status(200).json({ newComment });
      } catch (error) {
        next(error);
      }
    },
  );

commentRouter
  .route('/:id')
  .all(async (req, res, next) => {
    try {
      const { id } = req.params;
      const { dev, user_name } = req.dbUser;

      const bug_name = await _bugName(
        req.app.get('db'),
        id,
        dev,
        user_name,
      );

      if (!bug_name) {
        res.status(401).json({
          error: 'Bug not found/unauthorized comment query',
        });
        return;
      }

      req.bug_name = bug_name;
      next();
    } catch (error) {
      next(error);
    }
  })
  .get(async (req, res, next) => {
    try {
      const rawComment = await CRUDService.getBySearch(
        req.app.get('db'),
        TABLE_NAME,
        'id',
        req.params.id,
      );

      rawComment.bug_name = req.bug_name;

      const comment = SerializeService.formatComment(rawComment);

      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  })
  .patch(
    jsonBodyParser,
    validate.commentBody,
    async (req, res, next) => {
      try {
        const [updComment] = await CRUDService.updateEntry(
          req.app.get('db'),
          TABLE_NAME,
          'id',
          req.params.id,
          req.newComment,
        );

        updComment.bug_name = req.bug_name;

        const comment = SerializeService.formatComment(updComment);

        res
          .status(200)
          .json({ message: 'Update successful', comment });
      } catch (error) {
        next(error);
      }
    },
  )
  .delete(async (req, res, next) => {
    try {
      const [delComment] = await CRUDService.deleteEntry(
        req.app.get('db'),
        TABLE_NAME,
        'id',
        req.params.id,
      );

      delComment.bug_name = req.bug_name;

      const comment = SerializeService.formatComment(delComment);

      res.status(200).json({ message: 'Delete successful', comment });
    } catch (error) {
      next(error);
    }
  });

commentRouter.route('/bug/:bugId').get(async (req, res, next) => {
  try {
    const { bugId } = req.params;
    const { dev, user_name } = req.dbUser;

    const bug_name = await _bugName(
      req.app.get('db'),
      bugId,
      dev,
      user_name,
    );

    if (!bug_name) {
      res
        .status(401)
        .json({ error: 'Bug not found/unauthorized comment query' });
      return;
    }

    const rawComments = await CRUDService.getAllBySearchOrder(
      req.app.get('db'),
      TABLE_NAME,
      'bug_id',
      bugId,
      'created_at',
    );

    for (let i = 0; i < rawComments.length; i++) {
      rawComments[i].bug_name = bug_name;
    }

    const comments = rawComments.length
      ? SerializeService.formatAll(rawComments, TABLE_NAME)
      : `No comments found for bug: '${bug_name}'`;

    res.status(200).json({ filteredBy: 'bug_id', comments });
  } catch (error) {
    next(error);
  }
});

commentRouter.route('/user/:userName').get(async (req, res, next) => {
  try {
    const { userName } = req.params;
    const { dev, user_name } = req.dbUser;

    const rawComments = await CRUDService.getAllBySearchOrder(
      req.app.get('db'),
      TABLE_NAME,
      'user_name',
      userName,
      'updated_at',
    );

    for (let i = 0; i < rawComments.length; i++) {
      const { bug_id } = rawComments[i];
      rawComments[i].bug_name = await _bugName(
        req.app.get('db'),
        bug_id,
        dev,
        user_name,
      );
    }

    const comments = rawComments.length
      ? SerializeService.formatAll(rawComments, TABLE_NAME)
      : `No comments found for user: '${user_name}'`;

    res.status(200).json({ filteredBy: 'user_name', comments });
  } catch (error) {
    next(error);
  }
});

module.exports = commentRouter;
