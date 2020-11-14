const knex = require('knex');
const app = require('../../src/app');

describe.skip('Route: Bug router', () => {
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DB_URL
    });
    app.set('db', db);
  });

  afterEach('cleanup', () => helpers.cleanTables(db));

  after('disconnect from db', () => db.destroy());

  const seedAllTablesHook = () =>
    beforeEach('seed all data', () => helpers.seedAllTables(db));
})