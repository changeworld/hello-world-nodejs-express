var request = require('supertest');
var app = require('../app');

describe('/', function() {
  it('should be display', function(done) {
    request(app)
      .get('/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, done);
  });
});
