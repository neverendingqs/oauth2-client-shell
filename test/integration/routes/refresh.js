const assert = require('chai').assert;
const nock = require('nock');
const request = require('supertest-as-promised');

const app = require('../../../src/server');

const formPostRequestWithCsrf = require('../../utils').formPostRequestWithCsrf;

const authService = 'https://auth_service.local';
const tokenEndpoint = '/token_endpoint';
const clientId = 'c10fe586-60d8-436f-b5b4-8bc39732d967';
const clientSecret = '8d8e5150-e51b-4076-8f1c-6242d095e1ff';
const requestRefreshToken = 'bc91e930-caa3-4029-bf10-7ccf6a6c1cc8';
const requestScope = 'c96c9376-0e65-48cd-9872-7c27635b0a27';

const accessToken = '0515f627-8252-40f9-808a-1c72bbc985d5';
const responseRefreshToken = '67e04968-6f14-4d75-8837-13d6259e9907';
const responseScope = '3a598dc6-19ac-4ac7-994b-882b3305676c';

describe('POST /refresh', function() {
    it('error response redirects user to / with error', function() {
        let errBody = { error: 'error_response' };
        getNockWithRequest()
            .reply(401, errBody);

        return postToEndpoint().then(function(res) {
            assert.equal(res.header.location, '/?error=' + encodeURI(JSON.stringify(errBody)));
            assert.equal(res.status, 302);
        });
    });

    it('request error redirects user to / with error', function() {
        let errBody = { error: 'request_error' };
        getNockWithRequest()
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
                    scope: responseScope
                };
                if(includeRefreshToken) { tokenResponse.refresh_token = responseRefreshToken; }

                getNockWithRequest()
                    .reply(200, tokenResponse);

                return postToEndpoint().then(function(res) {
                    assert.equal(res.header.location, '/');
                    assert.equal(res.status, 302);

                    let bodyString = decodeURIComponent(res.header['set-cookie']);
                    assert.include(bodyString, `"accessToken":"${accessToken}"`);
                    assert.include(bodyString, '"focus":"refresh-token"');

                    if(includeRefreshToken) {
                        assert.include(bodyString, `"refreshToken":"${responseRefreshToken}"`);
                    } else {
                        assert.include(bodyString, `"refreshToken":"${requestRefreshToken}"`);
                    }
                });
            });
        });
    });
});

function getNockWithRequest() {
    return nock(authService)
        .post(tokenEndpoint, function(body) {
            return body.includes('grant_type=refresh_token')
                && body.includes('refresh_token=' + requestRefreshToken)
                && body.includes('scope=' + requestScope);
        })
        .basicAuth({
            user: clientId,
            pass: clientSecret
        });
}

function postToEndpoint() {
    return formPostRequestWithCsrf('/refresh', {
        token_endpoint: authService + tokenEndpoint,
        refresh_token: requestRefreshToken,
        client_id: clientId,
        client_secret: clientSecret,
        scope: requestScope
    });
}

