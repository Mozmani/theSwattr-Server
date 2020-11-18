const { TABLE_NAMES } = require('../constants/db.constants');
const { CRUDService } = require('../services');
const {
  auth,
  validate,
  Router,
  jsonBodyParser,
} = require('../middlewares');

const commentRouter = Router();
const TABLE_NAME = TABLE_NAMES.COMMENT_THREAD;

commentRouter.use(auth.requireAuth);

commentRouter
  .route('/')
  .get(async (req, res, next) => {
    try {
      const comments = await CRUDService.getAllData(
        req.app.get('db'),
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
      const newComment = await CRUDService.createEntry(
        req.app.get('db'),
        TABLE_NAME,
        req.newComment,
      );
      try {
        res.status(200).json();
      } catch (error) {
        next(error);
      }
    },
  );

commentRouter
  .route('/:id')
  .get(async (req, res, next) => {
    try {
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  })
  .patch(
    jsonBodyParser,
    validate.commentBody,
    async (req, res, next) => {
      try {
        res.status(200).json();
      } catch (error) {
        next(error);
      }
    },
  )
  .delete(async (req, res, next) => {
    try {
      res.status(200).json();
    } catch (error) {
      next(error);
    }
  });

commentRouter.route('/bug/:bugId').get(async (req, res, next) => {
  try {
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

commentRouter.route('/user/:userName').get(async (req, res, next) => {
  try {
    res.status(200).json();
  } catch (error) {
    next(error);
  }
});

module.exports = commentRouter;
