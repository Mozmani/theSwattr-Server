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

const bugName = async (db, bug_id) => {
  const { bug_name } = await CRUDService.getBySearch(
    db,
    TABLE_NAMES.BUG,
    'id',
    bug_id,
  );
  return bug_name;
};

commentRouter.use(auth.requireAuth);

commentRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const rawComments = await CRUDService.getAllDataByOrder(
        req.app.get('db'),
        TABLE_NAME,
        'created_at',
        'desc',
      );

      for (let i = 0; i < rawComments.length; i++) {
        const { bug_id } = rawComments[i];
        rawComments[i].bug_name = await bugName(
          req.app.get('db'),
          bug_id,
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
        const [newComment] = await CRUDService.createEntry(
          req.app.get('db'),
          TABLE_NAME,
          req.newComment,
        );

        newComment.bug_name = await bugName(
          req.app.get('db'),
          newComment.bug_id,
        );

        const comment = SerializeService.formatComment(newComment);

        res.status(200).json(comment);
      } catch (error) {
        next(error);
      }
    },
  );

commentRouter
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      const rawComment = await CRUDService.getBySearch(
        req.app.get('db'),
        TABLE_NAME,
        'id',
        req.params.id,
      );

      rawComment.bug_name = await bugName(
        req.app.get('db'),
        rawComment.bug_id,
      );

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
        );

        updComment.bug_name = await bugName(
          req.app.get('db'),
          updComment.bug_id,
        );

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
      const [delComment] = await CRUDService.deleteBySearch(
        req.app.get('db'),
        TABLE_NAME,
        'id',
        req.params.id,
      );

      delComment.bug_name = await bugName(
        req.app.get('db'),
        delComment.bug_id,
      );

      const comment = SerializeService.formatComment(delComment);

      res.status(200).json({ message: 'Delete successful', comment });
    } catch (error) {
      next(error);
    }
  });

commentRouter.route('/bug/:bugId').get(async (req, res, next) => {
  try {
    const rawComments = await CRUDService.getAllBySearch(
      req.app.get('db'),
      TABLE_NAME,
      'bug_id',
      req.params.bugId,
    );

    for (let i = 0; i < rawComments.length; i++) {
      const { bug_id } = rawComments[i];
      rawComments[i].bug_name = await bugName(
        req.app.get('db'),
        bug_id,
      );
    }

    const comments = SerializeService.formatAll(
      rawComments,
      TABLE_NAME,
    );

    res.status(200).json({ filteredBy: 'bug_id', comments });
  } catch (error) {
    next(error);
  }
});

commentRouter.route('/user/:userName').get(async (req, res, next) => {
  try {
    const rawComments = await CRUDService.getAllBySearch(
      req.app.get('db'),
      TABLE_NAME,
      'user_name',
      req.params.userName,
    );

    for (let i = 0; i < rawComments.length; i++) {
      const { bug_id } = rawComments[i];
      rawComments[i].bug_name = await bugName(
        req.app.get('db'),
        bug_id,
      );
    }

    const comments = SerializeService.formatAll(
      rawComments,
      TABLE_NAME,
    );

    res.status(200).json({ filteredBy: 'user_name', comments });
  } catch (error) {
    next(error);
  }
});

module.exports = commentRouter;
