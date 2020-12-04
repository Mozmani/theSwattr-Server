const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe('Route: Bug router', () => {
  const BUGS_EP = ROUTES.API + ROUTES.BUGS;
  const testDev = helpers.getSeedData().users_seed[0];
  const testUser = helpers.getSeedData().users_seed[1];

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
    return supertest(app).get('/api/bugs').expect(401);
  });

  describe(`ENDPOINT: '/bugs'`, () => {
    seedAllTablesHook();
    getAuthHeadersHook();

    context('GET', () => {
      it('all bugs when user is a dev', () => {
        return supertest(app)
          .get(BUGS_EP)
          .set(authHeaders.dev)
          .expect(200)
          .expect((res) => {
            expect(res.body.bugs).to.have.lengthOf(4);
          });
      });

      it('only user-bugs when user is not a dev', () => {
        return supertest(app)
          .get(BUGS_EP)
          .set(authHeaders.nonDev)
          .expect(200)
          .expect((res) => {
            expect(res.body.bugs).to.have.lengthOf(1);
          });
      });
    });

    context('POST', () => {
      it.skip('throws error if missing body fields', () => {});

      it('creates a new bug entry', () => {
        return supertest(app)
          .post(BUGS_EP)
          .set(authHeaders.dev)
          .send({
            id: '5',
            app: 'main-app',
            user_name: 'user_name1',
            bug_name: 'thisBug',
            description: 'this is a desc!',
          })
          .expect(200);
      });

      beforeEach('TODO - seed a new bug', () => {});

      it('creates new linkage-table entries', () => {
        return supertest(app)
          .post(BUGS_EP)
          .set(authHeaders.nonDev)
          .send({
            id: '5',
            app: 'main-app',
            user_name: 'user_name2',
            bug_name: 'thisBug2',
            description: 'this is a desc2!',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.newBug).to.include({
              status: 'pending',
              app: 'main-app',
              severity: 'pending',
            });
          });
      });

      it('returns formatted bug', () => {
        return supertest(app)
          .post(BUGS_EP)
          .set(authHeaders.nonDev)
          .send({
            id: '5',
            app: 'main-app',
            user_name: 'user_name2',
            bug_name: 'thisBug2',
            description: 'this is a desc2!',
          })
          .expect(200)
          .expect((res) => {
            expect(res.body.newBug).to.deep.equal({
              id: 5,
              bugPostedBy: 'user_name2',
              bugName: 'thisBug2',
              description: 'this is a desc2!',
              createdDate: res.body.newBug.createdDate,
              updatedDate: res.body.newBug.updatedDate,
              completedDate: null,
              completedNotes: null,
              status: 'pending',
              app: 'main-app',
              severity: 'pending',
            });
          });
      });
    });
  });

  // future feature tests
  describe('ENDPOINTS: filter routes', () => {
    const filterRoutes = [
      '/bugs/user/:userName',
      '/bugs/app/:app',
      '/bugs/status/:status',
      '/bugs/severity/:level',
    ];

    filterRoutes.forEach((route) => {
      context(`GET '${route}'`, () => {
        seedAllTablesHook();
        getAuthHeadersHook();

        let filtDevBugs;
        let filtUserBugs;
        let notFoundMessage;
        switch (route) {
          case '/user/:userName':
            filtDevBugs = null;
            filtUserBugs = filtDevBugs;
            notFoundMessage = 'No bugs found for user:';
            break;

          case '/app/:app':
            filtDevBugs = null;
            filtUserBugs = null;
            notFoundMessage = 'Wow! No bugs found for app:';
            break;

          case '/status/:status':
            filtDevBugs = null;
            filtUserBugs = null;
            notFoundMessage = 'No bugs found with status:';
            break;

          case '/severity/:level':
            filtDevBugs = null;
            filtUserBugs = null;
            notFoundMessage = 'No bugs found with severity:';
            break;

          default:
            break;
        }

        it.skip('throws an error if not a dev or correct user', () => {});

        [filtDevBugs, filtUserBugs].forEach((filtBugs, idx) => {
          const dev = idx === 0 ? 'dev' : 'non-dev';

          it.skip(`returns filtered bug list for ${dev}`, () => {});
        });

        it.skip('returns a message if there are no bugs', () => {
          helpers.cleanBugs(db);
        });
      });
    });
  });
});
