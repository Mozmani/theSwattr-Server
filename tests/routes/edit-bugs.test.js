const knex = require('knex');

const app = require('../../src/app');
const helpers = require('../test-helpers');

describe.skip('Route: Edit-Bugs router', () => {
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

  describe.skip(`ENDPOINT: '/edit/:bugId'`, () => {
    it.skip('returns and error if not a dev', () => {
      helpers.seedUsers(db);
    });

    context.skip('PATCH', () => {
      seedAllTablesHook();

      it.skip('returns error if missing bug body fields', () => {});

      it.skip('returns error if missing linkage body fields', () => {});

      it.skip('returns error if closing a bug has invalid fields', () => {});

      it.skip('updates bug table if bug is changed', () => {});

      it.skip('updates linkage tables if linkages are changed', () => {});

      it.skip('returns updated bug', () => {});
    });
  });
});
