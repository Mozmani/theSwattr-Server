process.env.NODE_ENV = 'test';
process.env.JWT_EXPIRY = '10s';

const { expect } = require('chai');
const supertest = require('supertest');
const knex = require('knex');

const {
  NODE_ENV,
  TEST_DB_URL,
  JWT_SECRET,
  JWT_EXPIRY,
} = require('../src/config');

global.expect = expect;
global.supertest = supertest;
global.knex = knex;
global.NODE_ENV = NODE_ENV;
global.TEST_DB_URL = TEST_DB_URL;
global.JWT_SECRET = JWT_SECRET;
global.JWT_EXPIRY = JWT_EXPIRY;
