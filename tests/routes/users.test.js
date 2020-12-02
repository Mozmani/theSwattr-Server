const knex = require('knex');

const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe.skip('Route: Users router', () => {
  const USERS_EP = ROUTES.API + ROUTES.USERS;

  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: TEST_DB_URL,
    });
    app.set('db', db);
  });

  const testDev = helpers.getSeedData().users_seed[0];
  const testUser = helpers.getSeedData().users_seed[1];

  const authHeaders = { dev: {}, nonDev: {} };
  const getAuthHeadersHook = () => {
    beforeEach("set auth headers", async () => {
      authHeaders.dev = await helpers.getAuthHeaders(
        app,
        testDev.user_name,
        db
      );
      authHeaders.nonDev = await helpers.getAuthHeaders(
        app,
        testUser.user_name,
        db
      );
    });
  };

  beforeEach('seed all users', () => helpers.seedUsers(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  after('disconnect from db', () => db.destroy());


  describe.skip(`ENDPOINT: '/users'`, () => {
    context.skip('GET', () => {
      getAuthHeadersHook();

      it.skip('rejects unauthorized user', () => {});

      it.skip('returns error if non-dev', () => {});

      it.skip('returns all users', () => {});
    });
  });

  describe.skip(`ENDPOINT: '/users/token'`, () => {
    context.skip('GET', () => {
      getAuthHeadersHook();

      it.skip('rejects unauthorized user', () => {});

      it.skip('returns authToken on success', () => {});
    });
  });

  describe.skip(`ENDPOINT: '/users/login'`, () => {
    it.skip('returns error if missing body fields', () => {});

    it.skip('returns error if invalid username', () => {});

    context.skip('POST', () => {
      it.skip('returns error if invalid password', () => {});

      it.skip('returns authToken on success', () => {});
    });
  });

  describe.skip(`ENDPOINT: '/users/register'`, () => {
    it.skip('returns error if missing body fields', () => {});

    context.skip('POST', () => {
      it.skip('returns error if invalid name', () => {});

      it.skip('creates new entry in users table', () => {});

      it.skip('returns authToken on success', () => {});
    });
  });

  const selfToggle = null;
  const userToggle = null;
  const devRoutes = [
    ['/users/dev', selfToggle],
    ['/users/dev/:userName', userToggle],
  ];

  devRoutes.forEach(([route, userData]) => {
    describe.skip(`ENDPOINT: '${route}'`, () => {
      getAuthHeadersHook();

      it.skip('rejects unauthorized user', () => {});

      it.skip('returns error if missing body fields', () => {});

      it.skip('returns error if dev_secret is invalid', () => {});

      context.skip('PATCH', () => {
        it.skip('toggles dev field in users table', () => {});

        it.skip('returns dev status of user', () => {});
      });
    });
  });
});
