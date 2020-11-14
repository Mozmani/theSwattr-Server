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
const commentThreadRouter = require('./comment-thread.router');
const usersRouter = require('./users.router');

module.exports = {
  bugRouter,
  commentThreadRouter,
  usersRouter,
};
