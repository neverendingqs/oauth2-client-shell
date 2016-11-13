var assert = require('chai').assert;
var request = require('supertest');

var app = require('../../src/server');

describe('GET /', function() {
    it('initial load', function(done) {
        request(app)
            .get('/')
            .expect(200, done);
    });
});
