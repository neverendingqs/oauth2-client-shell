const assert = require('chai').assert;
const request = require('supertest-as-promised');

const app = require('../../../src/server');

const formPostRequestWithCsrf = require('../../utils').formPostRequestWithCsrf;

describe('POST /auth', function() {
    it('redirects user with proper params', function() {
        return formPostRequestWithCsrf('/auth', {
            auth_endpoint: 'https://auth_service.com/authorization_endpoint',
            client_id: 'client_id',
            scope: 'scope',
            custom_params: 'key1=value1&key2=value2',
            state: 'state'
        }).then(function(res) {
            assert.equal(res.status, 302);
            assert.include(res.header.location, 'https://auth_service.com/authorization_endpoint');
            assert.include(res.header.location, 'response_type=code');
            assert.include(res.header.location, 'redirect_uri=');
            assert.include(res.header.location, 'client_id=client_id');
            assert.include(res.header.location, 'scope=scope');
            assert.include(res.header.location, 'state=state');
            assert.include(res.header.location, 'key1=value1&key2=value2');
        });
    });
});
