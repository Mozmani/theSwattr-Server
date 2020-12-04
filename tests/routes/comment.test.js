const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe('Route: Comment-Thread router', () => {
  const COMMENTS_EP = ROUTES.API + ROUTES.COMMENT_THREAD;
  const testDev = helpers.getSeedData().users_seed[0];
  const testUser = helpers.getSeedData().users_seed[1];
  const queries = helpers.getExpectedQueryData();

  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DB_URL,
    });
    app.set('db', db);
  });

  afterEach('cleanup', () => helpers.cleanTables(db));

  after('disconnect from db', () => db.destroy());

  const seedAllTablesHook = () => {
    beforeEach('seed all data', () => helpers.seedAllTables(db));
  };

  const authHeaders = { dev: {}, nonDev: {} };
  const getAuthHeadersHook = () => {
    beforeEach('set auth headers', async () => {
      authHeaders.dev = await helpers.getAuthHeaders(
        app,
        testDev.user_name,
        db,
      );
      authHeaders.nonDev = await helpers.getAuthHeaders(
        app,
        testUser.user_name,
        db,
      );
    });
  };

  it('rejects unauthorized user', () => {
    return supertest(app).get(COMMENTS_EP).expect(401);
  });

  describe(`ENDPOINT: '/comments'`, () => {
    seedAllTablesHook();
    getAuthHeadersHook();

    context('GET', () => {
      [true, false].forEach((devStatus) => {
        const reqs = queries.GET_REQUESTS;
        const text = devStatus ? 'a dev' : 'not a dev';

        it(`all comments when user is ${text}`, () => {
          const headers = devStatus
            ? authHeaders.dev
            : authHeaders.nonDev;

          return supertest(app)
            .get(COMMENTS_EP)
            .set(headers)
            .expect(200)
            .expect((res) => {
              const expectedComments = devStatus
                ? reqs.allCommentsUser1
                : reqs.allCommentsUser2;
              const { comments } = res.body;

              expectedComments.forEach((expCom, idx) => {
                const keys = Object.keys(expCom);
                keys.forEach((key) => {
                  if (key === 'createdDate') {
                    expect(comments[idx][key]).to.be.a('string');
                  } else
                    expect(comments[idx][key]).to.eql(expCom[key]);
                });
              });
            });
        });
      });
    });

    context('POST', () => {
      it('throws error if missing body fields', () => {
        return supertest(app)
          .post(COMMENTS_EP)
          .set(authHeaders.nonDev)
          .send({
            bug_id: 2,
          })
          .expect(400)
          .expect((res) => {
            expect(res.body).to.deep.equal({
              error: "Missing 'user_name' in request body",
            });
          });
      });

      it('throws error if bug_id is invalid', () => {
        return supertest(app)
          .post(COMMENTS_EP)
          .set(authHeaders.nonDev)
          .send({
            id: 5,
            bug_id: 6,
            user_name: 'user_name2',
            comment: 'new Comment',
          })
          .expect(500);
      });

      it('throws error if not a dev or correct user', () => {
        return supertest(app)
          .post(COMMENTS_EP)
          .set(authHeaders.nonDev)
          .send({
            id: 5,
            bug_id: 1,
            user_name: 'user_name2',
            comment: 'new Comment',
          })
          .expect(401)
          .expect((res) => {
            expect(res.body).to.eql({
              error: 'Bug not found/unauthorized comment query',
            });
          });
      });

      it('creates a new comment entry', () => {
        return supertest(app)
          .post(COMMENTS_EP)
          .set(authHeaders.nonDev)
          .send({
            id: 5,
            bug_id: 2,
            user_name: 'user_name2',
            comment: 'new Comment',
          })
          .expect(200);
      });

      it('returns formatted comment', () => {
        return supertest(app)
          .post(COMMENTS_EP)
          .set(authHeaders.nonDev)
          .send({
            id: 5,
            bug_id: 2,
            user_name: 'user_name2',
            comment: 'new Comment',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body).to.eql({
              newComment: {
                id: 5,
                bugName: 'bug_name2',
                userName: 'user_name2',
                comment: 'new Comment',
                createdDate: res.body.newComment.createdDate,
              },
            });
          });
      });
    });
  });

  describe(`ENDPOINT: '/comments/:id'`, () => {
    seedAllTablesHook();
    getAuthHeadersHook();

    it('throws error if bug_id is invalid', () => {
      return supertest(app)
        .get(`/api/comments/5`)
        .set(authHeaders.nonDev)
        .expect(500);
    });

    it('throws error if not a dev or correct user', () => {
      return supertest(app)
        .get(`/api/comments/4`)
        .set(authHeaders.nonDev)
        .expect(401)
        .expect((res) => {
          expect(res.body).to.eql({
            error: 'Bug not found/unauthorized comment query',
          });
        });
    });

    context('GET', () => {
      it('formatted comment by id', () => {
        return supertest(app)
          .get(`/api/comments/2`)
          .set(authHeaders.nonDev)
          .expect(200)
          .expect((res) => {
            expect(res.body).to.eql({
              id: 2,
              bugName: 'bug_name2',
              userName: 'user_name2',
              comment: 'comment2',
              createdDate: res.body.createdDate,
            });
          });
      });
    });

    // future feature tests!
    context.skip('PATCH', () => {
      it.skip('successfully updates comment', () => {});

      it.skip('returns message and formatted updated comment', () => {});
    });

    // future feature tests!
    context.skip('DELETE', () => {
      it.skip('successfully deletes comment', () => {});

      it.skip('returns message and formatted deleted comment', () => {});
    });
  });

  // future feature tests!
  describe('ENDPOINT: filter routes', () => {
    const filterRoutes = [
      '/comments/bug/:bugId',
      '/comments/user/:userName',
    ];

    filterRoutes.forEach((route) => {
      context.skip(`GET '${route}'`, () => {
        seedAllTablesHook();

        let filtComments;
        let notFoundMessage;
        switch (route) {
          case '/bug/:bugId':
            filtComments = null;
            notFoundMessage = 'No comments found for bug:';
            break;

          case '/user/:userName':
            filtComments = null;
            notFoundMessage = 'No comments found for user:';
            break;

          default:
            break;
        }

        it.skip('returns filtered comments list', () => {});

        it.skip('returns a message if there are no comments', () => {});
      });
    });
  });
});
