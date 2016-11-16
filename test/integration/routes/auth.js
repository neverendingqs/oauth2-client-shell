const assert = require('chai').assert;
const request = require('supertest');

const app = require('../../../src/server');

const getCsrfTokens = require('../../utils').getCsrfTokens;

describe('POST /auth', function() {
    it('happy path', function(done) {
        getCsrfTokens(function(cookieCsrf, formCsrf) {
            request(app)
                .post('/auth')
                .set('Cookie', `_csrf=${cookieCsrf}`)
                .type('form')
                .send({
                    _csrf: formCsrf,
                    auth_endpoint: 'auth_endpoint',
                    client_id: 'client_id',
                    scope: 'scope',
                    custom_params: 'key1=value1&key2=value2',
                    state: 'state'
                })
                // WIP
                .expect(302, done);
        });
    });
});
