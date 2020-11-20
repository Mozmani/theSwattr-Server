/*
|--------------------------------------------------------------------------
| BARREL EXPORT FILE
|--------------------------------------------------------------------------
| How-To barrel-export components:
| const thingsRouter = require('./things/thingsRouter')
|
| module.exports = {
|   thingsRouter
| }
|
| Why? Readability:
| const { thingsRouter, stuffRouter, userRouter } = require('./routes')
*/
const bugRouter = require('./bug.router');
const commentRouter = require('./comment.router');
const sortBugsRouter = require('./sort-bugs.router');
const usersRouter = require('./users.router');

module.exports = {
  bugRouter,
  commentRouter,
  sortBugsRouter,
  usersRouter,
};
