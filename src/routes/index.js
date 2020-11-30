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
const appRouter = require('./app.router');
const bugRouter = require('./bug.router');
const commentRouter = require('./comment.router');
const editBugsRouter = require('./edit-bugs.router');
const sortBugsRouter = require('./sort-bugs.router');
const usersRouter = require('./users.router');

module.exports = {
  appRouter,
  bugRouter,
  commentRouter,
  editBugsRouter,
  sortBugsRouter,
  usersRouter,
};
