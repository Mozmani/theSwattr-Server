const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe('Route: Users router', () => {
  const USERS_EP = ROUTES.API + ROUTES.USERS;
  const queries = helpers.getExpectedQueryData();
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

  beforeEach('seed all users', () => helpers.seedUsers(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  after('disconnect from db', () => db.destroy());

  describe(`ENDPOINT: '/users'`, () => {
    context('GET', () => {
      getAuthHeadersHook();

      it('returns error if missing token', () => {
        return supertest(app)
          .get(USERS_EP)
          .expect(401)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql('Missing bearer token');
          });
      });

      it('returns error if non-dev', () => {
        return supertest(app)
          .get(USERS_EP)
          .set(authHeaders.nonDev)
          .expect(401)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql('Unauthorized request');
          });
      });

      it('returns all users', () => {
        return supertest(app)
          .get(USERS_EP)
          .set(authHeaders.dev)
          .expect(200)
          .then((res) => {
            const { allUsers } = res.body;
            expect(allUsers).to.eql(queries.GET_REQUESTS.allUsers);
          });
      });
    });
  });

  describe(`ENDPOINT: '/users/token'`, () => {
    context('GET', () => {
      getAuthHeadersHook();

      it('returns error if token is invalid', () => {
        return supertest(app)
          .get(`${USERS_EP}/token`)
          .set(helpers.invalidHeader)
          .expect(500)
          .then((res) => {
            const { message } = res.body;
            expect(message).to.eql('jwt malformed');
          });
      });

      it('returns authToken on success', () => {
        return supertest(app)
          .get(`${USERS_EP}/token`)
          .set(authHeaders.dev)
          .expect(200)
          .then((res) => {
            const { authToken } = res.body;
            expect(authToken).to.be.a('string');
          });
      });
    });
  });

  describe(`ENDPOINT: '/users/login'`, () => {
    context('POST', () => {
      const { user_name } = testDev;
      const password = helpers.getUserPassword(user_name);

      it('returns error if missing body fields', () => {
        return supertest(app)
          .post(`${USERS_EP}/login`)
          .expect(400)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql(
              "Missing 'user_name' in request body",
            );
          });
      });

      it('returns error if invalid username', () => {
        return supertest(app)
          .post(`${USERS_EP}/login`)
          .send({ user_name: 'invalid', password })
          .expect(401)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql('Incorrect username or password');
          });
      });

      it('returns error if invalid password', () => {
        return supertest(app)
          .post(`${USERS_EP}/login`)
          .send({ user_name, password: 'invalid' })
          .expect(401)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql('Incorrect username or password');
          });
      });

      it('returns authToken on success', () => {
        return supertest(app)
          .post(`${USERS_EP}/login`)
          .send({ user_name, password })
          .expect(200)
          .then((res) => {
            const { authToken } = res.body;
            expect(authToken).to.be.a('string');
          });
      });
    });
  });

  describe(`ENDPOINT: '/users/register'`, () => {
    const { safeUser } = helpers.getClientSubmissions();

    context('POST', () => {
      it('returns error if missing body fields', () => {
        return supertest(app)
          .post(`${USERS_EP}/register`)
          .expect(400)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql(
              "Missing 'first_name' in request body",
            );
          });
      });

      it('returns error if invalid password', () => {
        return supertest(app)
          .post(`${USERS_EP}/register`)
          .send({ ...safeUser.request, password: 'invalid' })
          .expect(400)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql(
              'Password be longer than 8 characters',
            );
          });
      });

      it('returns error if invalid email', () => {
        return supertest(app)
          .post(`${USERS_EP}/register`)
          .send({ ...safeUser.request, email: 'invalid' })
          .expect(400)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql('You must use a valid email!');
          });
      });

      getAuthHeadersHook();

      it('creates new entry in users table and returns authToken', () => {
        return supertest(app)
          .post(`${USERS_EP}/register`)
          .send(safeUser.request)
          .expect(201)
          .then((res) => {
            const { authToken } = res.body;
            expect(authToken).to.be.a('string');

            return supertest(app)
              .get(USERS_EP)
              .set(authHeaders.dev)
              .expect(200)
              .then((res_) => {
                const { allUsers } = res_.body;
                safeUser.result.password = allUsers[3].password || '';

                expect(allUsers).to.be.lengthOf(4);
                expect(allUsers).to.eql([
                  ...queries.GET_REQUESTS.allUsers,
                  safeUser.result,
                ]);
              });
          });
      });
    });
  });

  const devRoutes = [`${USERS_EP}/dev`, `${USERS_EP}/dev/user_name1`];

  devRoutes.forEach((route) => {
    describe(`ENDPOINT: PATCH '${route}'`, () => {
      getAuthHeadersHook();
      const dev_secret = 'irdev';

      it('rejects unauthorized user', () => {
        return (
          route === `${USERS_EP}/dev/user_name1` &&
          supertest(app)
            .patch(route)
            .send({ dev_secret })
            .set(authHeaders.nonDev)
            .expect(401)
            .then((res) => {
              const { error } = res.body;
              expect(error).to.eql('Unauthorized request');
            })
        );
      });

      it('returns error if missing body fields', () => {
        return supertest(app)
          .patch(route)
          .set(authHeaders.nonDev)
          .expect(400)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql(
              "Missing 'dev_secret' in request body",
            );
          });
      });

      it('returns error if dev_secret is invalid', () => {
        return supertest(app)
          .patch(route)
          .send({ dev_secret: 'invalid' })
          .set(authHeaders.dev)
          .expect(401)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql('Invalid code');
          });
      });

      it('toggles dev field and returns dev status of user', () => {
        const result =
          route === `${USERS_EP}/dev`
            ? { devStatus: 'Dev status: false' }
            : { user_name1: 'Dev status: false' };

        return supertest(app)
          .patch(route)
          .send({ dev_secret })
          .set(authHeaders.dev)
          .expect(201)
          .then((res) => {
            expect(res.body).to.eql(result);
          });
      });
    });
  });
});
