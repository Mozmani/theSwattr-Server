const knex = require('knex');

const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe.skip('Route: Sort-Bugs router', () => {
  const SORT_BUGS_EP = ROUTES.API + ROUTES.SORT_BUGS;
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

  describe.skip(`ENDPOINT: '/sort/status/:app'`, () => {
    context.skip('GET', () => {
      const devResults = null;
      const userResults = null;

      [(devResults, userResults)].forEach((results, idx) => {
        const dev = idx === 0 ? 'dev' : 'non-dev';

        it.skip(`returns sorted arrays by ${dev}`, () => {});
      });
    });
  });

  describe.skip(`ENDPOINT: '/sort/app'`, () => {
    context.skip('GET', () => {
      const devResults = null;
      const userResults = null;

      [(devResults, userResults)].forEach((results, idx) => {
        const dev = idx === 0 ? 'dev' : 'non-dev';

        it.skip(`returns sorted arrays by ${dev}`, () => {});
      });
    });
  });

  describe.skip(`ENDPOINT: '/sort/severity/:app'`, () => {
    context.skip('GET', () => {
      const devResults = null;
      const userResults = null;

      [(devResults, userResults)].forEach((results, idx) => {
        const dev = idx === 0 ? 'dev' : 'non-dev';

        it.skip(`returns sorted arrays by ${dev}`, () => {});
      });
    });
  });
});
