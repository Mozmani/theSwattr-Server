const knex = require('knex');

const app = require('../../src/app');
const helpers = require('../test-helpers');

describe.skip('Route: Comment-Thread router', () => {
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

  describe.skip(`ENDPOINT: '/comments'`, () => {
    context.skip('GET', () => {
      seedAllTablesHook();

      it.skip('all comments when user is a dev', () => {});

      it.skip('only user-comments when user is not a dev', () => {});
    });

    context.skip('POST', () => {
      it.skip('throws error if missing body fields', () => {});

      it.skip('throws error if bug_id is invalid', () => {});

      it.skip('throws error if not a dev or correct user', () => {});

      it.skip('creates a new comment entry', () => {});

      it.skip('returns formatted comment', () => {});
    });
  });

  describe.skip(`ENDPOINT: '/comments/:id'`, () => {
    seedAllTablesHook();

    it.skip('throws error if bug_id is invalid', () => {});

    it.skip('throws error if not a dev or correct user', () => {});

    context.skip('GET', () => {
      it.skip('formatted comment by id', () => {});
    });

    context.skip('PATCH', () => {
      it.skip('successfully updates comment', () => {});

      it.skip('returns message and formatted updated comment', () => {});
    });

    context.skip('DELETE', () => {
      it.skip('successfully deletes comment', () => {});

      it.skip('returns message and formatted deleted comment', () => {});
    });
  });

  describe.skip('ENDPOINT: filter routes', () => {
    const filterRoutes = [
      '/comments/bug/:bugId',
      '/comments/user/:userName',
    ];

    filterRoutes.forEach((route) => {
      context.skip(`GET '${route}'`, () => {
        seedAllTablesHook();

        let filtComments;
        let notFoundMessage;
        switch (route) {
          case '/bug/:bugId':
            filtComments = null;
            notFoundMessage = 'No comments found for bug:';
            break;

          case '/user/:userName':
            filtComments = null;
            notFoundMessage = 'No comments found for user:';
            break;

          default:
            break;
        }

        it.skip('returns filtered comments list', () => {});

        it.skip('returns a message if there are no comments', () => {});
      });
    });
  });
});
