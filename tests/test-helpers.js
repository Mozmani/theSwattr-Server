const {
  TABLE_NAMES: {
    BUG,
    COMMENT_THREAD,
    USERS,
    APP,
    SEVERITY_LEVEL,
    STATUS,
  },
  BUG_TABLE,
  COMMENT_THREAD_TABLE,
  USERS_TABLE,
  APP_TABLE,
  BUG_SEVERITY_LEVEL_TABLE,
  BUG_STATUS_TABLE,
} = require('../src/constants/db.constants');

/*
|--------------------------------------------------------------------------
| Seed Data
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Safe Client-side submission data
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Malicious Client-side submission data
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Helper functions
|--------------------------------------------------------------------------
*/
const cleanTables = (db) => {
  return db.raw(`TRUNCATE users RESTART IDENTITY CASCADE;`);
};

const getSeedData = () => ({});

const getExpectedData = () => ({});

const seedTable = (db, table, data) => db(table).insert(data);

const seedUsers = (db) => db(USERS).insert(users);

const seedAllTables = async (db) => {
  await db(BUG).insert();
  await db(COMMENT_THREAD).insert();
  await db(USERS).insert();
  await db(APP).insert();
  await db(SEVERITY_LEVEL).insert();
  await db(STATUS).insert();
};

const getMaliciousSeedData = () => ({
  maliciousUserSeed,
  maliciousSongSeed,
  maliciousSetSeed,
  maliciousGigSeed,
});

const seedMaliciousTable = (db, table, data) =>
  db(table).insert(data);

const seedAllMaliciousTables = async (db) => {
  await db(BUG).insert();
  await db(COMMENT_THREAD).insert();
  await db(USERS).insert();
};

const getClientSubmissions = () => ({});

const getMaliciousSubmissions = () => ({
  maliciousUser,
  maliciousSong,
  maliciousSet,
  maliciousGig,
});

const createFetchBody = (table) => {
  let safeReq;
  let maliciousReq;

  switch (table) {
    case BUG:
      safeReq = null;
      maliciousReq = null;
      break;

    case COMMENT_THREAD:
      safeReq = null;
      maliciousReq = null;
      break;

    case USERS:
      safeReq = null;
      maliciousReq = null;
      break;

    case APP:
      safeReq = null;
      break;

    case SEVERITY_LEVEL:
      safeReq = null;
      break;

    case STATUS:
      safeReq = null;
      break;

    default:
      break;
  }

  const body = { safeReq, maliciousReq };
  return body;
};

module.exports = {
  cleanTables,
  getSeedData,
  getExpectedData,
  seedTable,
  seedUsers,
  seedAllTables,

  getMaliciousSeedData,
  seedMaliciousTable,
  seedAllMaliciousTables,

  getClientSubmissions,
  getMaliciousSubmissions,

  createFetchBody,
};
