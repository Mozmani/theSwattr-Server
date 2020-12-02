const knex = require('knex');

const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe.skip('Route: App router', () => {
  const USERS_EP = ROUTES.API + ROUTES.USERS;
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

  it.skip('rejects unauthorized user', () => {
    helpers.seedUsers(db);
  });

  describe.skip(`ENDPOINT: '/app'`, () => {
    seedAllTablesHook();
    getAuthHeadersHook();

    context.skip('GET', () => {
      it.skip('all formatted apps', () => {});
    });
  });
});
