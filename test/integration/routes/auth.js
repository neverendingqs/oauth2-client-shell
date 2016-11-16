const assert = require('chai').assert;
const request = require('supertest');

const app = require('../../../src/server');

const getCsrfTokens = require('../../utils').getCsrfTokens;

describe('POST /auth', function() {
    it('redirects user with proper params', function(done) {
        getCsrfTokens(function(cookieCsrf, formCsrf) {
            request(app)
                .post('/auth')
                .set('Cookie', `_csrf=${cookieCsrf}`)
                .type('form')
                .send({
                    _csrf: formCsrf,
                    auth_endpoint: 'https://auth_service.com/authorization_endpoint',
                    client_id: 'client_id',
                    scope: 'scope',
                    custom_params: 'key1=value1&key2=value2',
                    state: 'state'
                })
                .expect(302)
                .end(function(err, res) {
                    assert.include(res.header.location, 'https://auth_service.com/authorization_endpoint');
                    assert.include(res.header.location, 'response_type=code');
                    assert.include(res.header.location, 'redirect_uri=');
                    assert.include(res.header.location, 'client_id=client_id');
                    assert.include(res.header.location, 'scope=scope');
                    assert.include(res.header.location, 'state=state');
                    assert.include(res.header.location, 'key1=value1&key2=value2');
                    done();
                });
        });
    });
});
