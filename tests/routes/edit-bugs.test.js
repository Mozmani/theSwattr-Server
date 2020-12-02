const knex = require('knex');

const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe.skip('Route: Edit-Bugs router', () => {
  const EDIT_BUGS_EP = ROUTES.API + ROUTES.EDIT_BUGS;
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

  it.skip('rejects unauthorized user', () => {});

  describe.skip(`ENDPOINT: '/edit/:bugId'`, () => {
    it.skip('returns and error if not a dev', () => {});

    context.skip('PATCH', () => {
      it.skip('returns error if missing bug body fields', () => {});

      it.skip('returns error if missing linkage body fields', () => {});

      it.skip('returns error if closing a bug has invalid fields', () => {});

      it.skip('updates bug table if bug is changed', () => {});

      it.skip('updates linkage tables if linkages are changed', () => {});

      it.skip('returns updated bug', () => {});
    });
  });
});
