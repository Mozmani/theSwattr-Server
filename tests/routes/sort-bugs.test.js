const knex = require('knex');

const app = require('../../src/app');
const helpers = require('../test-helpers');

describe.skip('Route: Sort-Bugs router', () => {
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

  it.skip('rejects unauthorized user', () => {
    helpers.seedUsers(db);
  });

  describe.skip(`ENDPOINT: '/sort/status/:app'`, () => {
    seedAllTablesHook();

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
