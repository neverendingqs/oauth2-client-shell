const assert = require('chai').assert;
const nock = require('nock');
const request = require('supertest-as-promised');

const app = require('../../../src/server');

const formPostRequestWithCsrf = require('../../utils').formPostRequestWithCsrf;

const authService = 'https://auth_service.local';
const tokenEndpoint = '/authorization_endpoint';
const clientId = 'bfff5722-a0a6-4603-862c-d80cdf9bb50f';
const clientSecret = '2fb53528-fc34-4499-af8d-8a2dde7c47bb';
const authCode = 'f86d7d40-84cc-4bc9-9e9b-8b6af2001166';
const accessToken = 'f3d036a0-962f-4a0f-9535-b75a58e9ff02';
const refreshToken = '5df64db9-309e-44a1-9387-add3345a0c5b';

describe('POST /token', function() {
    it('error response redirects user to / with error', function() {
        let errBody = { error: 'error_response' };
        getNockWithRequest(authService)
            .reply(401, errBody);

        return postToEndpoint().then(function(res) {
            assert.equal(res.header.location, '/?error=' + encodeURI(JSON.stringify(errBody)));
            assert.equal(res.status, 302);
        });
    });

    it('request error redirects user to / with error', function() {
        let errBody = { error: 'request_error' };
        getNockWithRequest(authService)
            .replyWithError(errBody);

        return postToEndpoint().then(function(res) {
            assert.equal(res.header.location, '/?error=' + encodeURI(JSON.stringify(errBody)));
            assert.equal(res.status, 302);
        });
    });

    describe('successful token response redirects user with proper params', function() {
        [true, false].forEach(function(includeRefreshToken) {
            it(`response ${includeRefreshToken ? '' : 'does not '}include refresh token`, function() {
                // https://tools.ietf.org/html/rfc6749#section-5.1
                let tokenResponse = {
                    access_token: accessToken,
                    token_type: 'example',
                    expires_in: 3600,
                    scope: 'scope'
                };
                if(includeRefreshToken) { tokenResponse.refresh_token = refreshToken; }

                getNockWithRequest(authService)
                    .reply(200, tokenResponse);

                return postToEndpoint().then(function(res) {
                    assert.equal(res.header.location, '/');
                    assert.equal(res.status, 302);

                    let bodyString = decodeURIComponent(res.header['set-cookie']);
                    assert.include(bodyString, `"accessToken":"${accessToken}"`);
                    assert.include(bodyString, `"authCode":"(Used) ${authCode}"`);
                    assert.include(bodyString, '"focus":"refresh-token"');

                    if(includeRefreshToken) {
                        assert.include(bodyString, `"refreshToken":"${refreshToken}"`);
                    } else {
                        assert.include(bodyString, '"refreshToken":"Not provided by token endpoint."');
                    }
                });
            });
        });
    });
});

function getNockWithRequest() {
    return nock(authService)
        .post(tokenEndpoint, function(body) {
            return body.includes('grant_type=authorization_code')
                && body.includes('redirect_uri=' + encodeURIComponent('http://127.0.0.1'))
                && body.includes('code=' + authCode);
        })
        .basicAuth({
            user: clientId,
            pass: clientSecret
        });
}

function postToEndpoint() {
    return formPostRequestWithCsrf('/token', {
        token_endpoint: authService + tokenEndpoint,
        auth_code: authCode,
        client_id: clientId,
        client_secret: clientSecret
    });
}

