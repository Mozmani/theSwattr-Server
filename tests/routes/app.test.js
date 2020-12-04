const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe('Route: App router', () => {
  const APP_EP = ROUTES.API + ROUTES.APP;
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

  describe(`ENDPOINT: '/app'`, () => {
    context('GET', () => {
      it('returns error if missing token', () => {
        return supertest(app)
          .get(APP_EP)
          .expect(401)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql('Missing bearer token');
          });
      });

      it('returns formatted apps', () => {
        return supertest(app)
          .get(APP_EP)
          .set(authHeaders.dev)
          .expect(200)
          .expect((res) => {
            const { allApps } = queries.GET_REQUESTS;
            const { apps } = res.body;
            expect(apps).to.deep.equal(allApps);
          });
      });
    });
  });
});
