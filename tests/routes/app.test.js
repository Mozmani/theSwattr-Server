const knex = require("knex");

const app = require("../../src/app");
const helpers = require("../test-helpers");
const { ROUTES } = require("../../src/constants/endpoints.constants");
const { expect } = require("chai");

describe("Route: App router", () => {
  const APP_EP = ROUTES.API + ROUTES.APP;
  const testDev = helpers.getSeedData().users_seed[0];
  const testUser = helpers.getSeedData().users_seed[1];

  let db;
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: TEST_DB_URL,
    });
    app.set("db", db);
  });

  afterEach("cleanup", () => helpers.cleanTables(db));

  after("disconnect from db", () => db.destroy());

  const authHeaders = { dev: {}, nonDev: {} };
  beforeEach("set auth headers", async () => {
    await helpers.seedAllTables(db);

    authHeaders.dev = await helpers.getAuthHeaders(app, testDev.user_name, db);
    authHeaders.nonDev = await helpers.getAuthHeaders(
      app,
      testUser.user_name,
      db
    );
  });

  it("rejects unauthorized user", () => {
    return supertest(app).get(APP_EP).expect(401);
  });

  describe(`ENDPOINT: '/app'`, () => {
    context("GET", () => {
      it("all formatted apps", () => {
        const result = {
          apps: [
            { id: 1, rawName: "main-app", formatName: "Main App" },
            { id: 2, rawName: "second-app", formatName: "Second App" },
          ],
        };

        return supertest(app)
          .get(APP_EP)
          .set(authHeaders.dev)
          .expect(200)
          .expect((res) => {
            expect(res.body).to.deep.equal(result);
          });
      });
    });
  });
});
