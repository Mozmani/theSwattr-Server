const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe('Route: Sort-Bugs router', () => {
  const SORT_BUGS_EP = ROUTES.API + ROUTES.SORT_BUGS;
  const testDev = helpers.getSeedData().users_seed[0];
  const testUser = helpers.getSeedData().users_seed[1];
  const queries = helpers.getExpectedQueryData();
  const { sorts } = queries.GET_REQUESTS;

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

  const authHeaders = { dev: {}, nonDev: {} };
  beforeEach('set auth headers', async () => {
    await helpers.seedAllTables(db);

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

  const sortRoutes = {
    status: '/status/main-app',
    app: '/app',
    severity: '/severity/main-app',
  };
  const sortTypes = Object.keys(sortRoutes);

  sortTypes.forEach((type) => {
    context(`ENDPOINT: GET '/sort${sortRoutes[type]}'`, () => {
      const nonDevResults = sorts[type].nonDev;
      const devResults = sorts[type].dev;
      const tests = [nonDevResults, devResults];

      tests.forEach((expected, isDev) => {
        const text = isDev ? 'dev' : 'non-dev';
        const ENDPOINT = SORT_BUGS_EP + sortRoutes[type];

        // ? only run once per route
        if (!isDev) {
          it('returns error if missing token', () => {
            return supertest(app)
              .get(ENDPOINT)
              .expect(401)
              .then((res) => {
                const { error } = res.body;
                expect(error).to.eql('Missing bearer token');
              });
          });
        }

        it(`returns sorted arrays by ${text}`, () => {
          const headers = isDev ? authHeaders.dev : authHeaders.nonDev;

          return supertest(app)
            .get(ENDPOINT)
            .set(headers)
            .expect(200)
            .then((res) => {
              const { body } = res;
              const keys = Object.keys(expected);
              keys.forEach((key) => {
                expected[key].forEach((bug, idx) => {
                  const resBug = body[key][idx];
                  const { createdDate, updatedDate } = resBug;
                  const expBug = { ...bug, createdDate, updatedDate };

                  expect(createdDate).to.be.a('string');
                  expect(updatedDate).to.be.a('string');
                  expect(resBug).to.eql(expBug);
                });
              });
            });
        });
      });
    });
  });
});
