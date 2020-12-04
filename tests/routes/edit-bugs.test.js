const app = require('../../src/app');
const helpers = require('../test-helpers');
const { ROUTES } = require('../../src/constants/endpoints.constants');

describe('Route: Edit-Bugs router', () => {
  const EDIT_BUGS_EP = `${ROUTES.API + ROUTES.EDIT_BUGS}/1`;
  const testDev = helpers.getSeedData().users_seed[0];
  const testUser = helpers.getSeedData().users_seed[1];
  const {
    devBug1FullUpdate,
    devBug1InvalidUpdate,
    devBug1UpdateBodies,
  } = helpers.getDevOnlySubmissions();

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

  describe(`ENDPOINT: '/edit/:bugId'`, () => {
    context('PATCH', () => {
      it('returns error if missing token', () => {
        return supertest(app)
          .patch(EDIT_BUGS_EP)
          .expect(401)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql('Missing bearer token');
          });
      });

      it('returns and error if not a dev', () => {
        return supertest(app)
          .patch(EDIT_BUGS_EP)
          .set(authHeaders.nonDev)
          .expect(401)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql('Unauthorized edit request');
          });
      });

      it('returns error if missing bug body fields', () => {
        return supertest(app)
          .patch(EDIT_BUGS_EP)
          .set(authHeaders.dev)
          .send(devBug1UpdateBodies.linkageBody)
          .expect(400)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql(
              "Missing 'user_name' in request body",
            );
          });
      });

      it('returns error if missing linkage body fields', () => {
        return supertest(app)
          .patch(EDIT_BUGS_EP)
          .set(authHeaders.dev)
          .send(devBug1UpdateBodies.bugBody)
          .expect(400)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql("Missing 'status' in request body");
          });
      });

      it('returns error if closing a bug has invalid fields', () => {
        return supertest(app)
          .patch(EDIT_BUGS_EP)
          .set(authHeaders.dev)
          .send(devBug1InvalidUpdate)
          .expect(401)
          .then((res) => {
            const { error } = res.body;
            expect(error).to.eql("Status must be 'closed'");
          });
      });

      it('returns updated bug', () => {
        const { request, result } = devBug1FullUpdate;

        return supertest(app)
          .patch(EDIT_BUGS_EP)
          .set(authHeaders.dev)
          .send(request)
          .expect(200)
          .then((res) => {
            const { editBug } = res.body;
            const {
              createdDate,
              updatedDate,
              completedDate,
            } = editBug;
            const expected = {
              ...result,
              createdDate,
              updatedDate,
              completedDate,
            };

            expect(createdDate).to.be.a('string');
            expect(updatedDate).to.be.a('string');
            expect(completedDate).to.eql(null);
            expect(editBug).to.eql(expected);
          });
      });
    });
  });
});
