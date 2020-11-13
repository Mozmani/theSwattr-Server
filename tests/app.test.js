const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 200 containing "Express boilerplate initialized!"', () => {
    return supertest(app)
      .get('/')
      .expect(200, 'Express boilerplate initialized!')
  })
})