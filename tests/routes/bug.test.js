const knex = require('knex');
const supertest = require('supertest');

const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe('Route: Bug router', () => {
  const BUGS_EP = ROUTES.API + ROUTES.BUGS;
  const USERS_EP = ROUTES.API + ROUTES.USERS;
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

  it.skip('rejects unauthorized user', () => {
    helpers.seedUsers(db);
  });

  describe(`ENDPOINT: '/bugs'`, () => {
    context('GET', () => {
      seedAllTablesHook();
      getAuthHeadersHook();

      it('all bugs when user is a dev', () => {
        return supertest(app)
          .get(BUGS_EP)
          .set(authHeaders.dev)
          .expect(200)
          .expect((res) => {
            expect(res.body.bugs).to.have.lengthOf(4);
          });
      });

      it.skip('only user-bugs when user is not a dev', () => {});
    });

    context.skip('POST', () => {
      it.skip('throws error if missing body fields', () => {});

      it.skip('creates a new bug entry', () => {});

      beforeEach('TODO - seed a new bug', () => {});

      it.skip('creates new linkage-table entries', () => {});

      it.skip('creates new linkage-table entries', () => {});

      it.skip('returns formatted bug', () => {});
    });
  });

  describe.skip('ENDPOINTS: filter routes', () => {
    const filterRoutes = [
      '/bugs/user/:userName',
      '/bugs/app/:app',
      '/bugs/status/:status',
      '/bugs/severity/:level',
    ];

    filterRoutes.forEach((route) => {
      context.skip(`GET '${route}'`, () => {
        seedAllTablesHook();

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
