const assert = require('chai').assert;
const request = require('supertest-as-promised');

const app = require('../../../src/server');

const createCookieString = require('../../utils').createCookieString;

describe('GET /', function() {
    it('initial load includes csrf token', function() {
        let req = request(app)
            .get('/');

        return setCommonExpectations(req);
    });

    it('reset parameter resets cookie', function() {
        const preExistingCookie = createCookieString({ foo: "bar" });
        const responseCookie = new RegExp(createCookieString() + "; Path=/");

        let req = request(app)
            .get('/?reset=true')
            .set('Cookie', preExistingCookie);

        return setCommonExpectations(req)
            .expect('set-cookie', responseCookie);
    });

    it('clear parameter clears certain cookie values', function() {
        const preExistingCookie = createCookieString({
            authCode: "authCode",
            authEndpoint: "authEndpoint",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
            focus: "focus"
        });
        const responseCookie = new RegExp(
            createCookieString({
                authCode: null,
                authEndpoint: "authEndpoint",
                accessToken: null,
                refreshToken: null,
                focus: null
            })
        );

        let req = request(app)
            .get('/?clear=true')
            .set('Cookie', preExistingCookie);

        return setCommonExpectations(req)
            .expect('set-cookie', /httponly/i)
            .expect('set-cookie', responseCookie);
    });

    it('displays an error if the the state doesn\'t match the state in the authorization response', function() {
        const cookieState = 'cookieState_e578ec8c-561e-49ee-8a92-0f369006b001';
        const responseState = 'responseState_960b7de7-19e5-44f0-8b8d-dba65e26e186';
        const authCode = 'authCode_6f9b363c-1f52-4d4e-90aa-9ca99a546641';

        const preExistingCookie = createCookieString({ state: cookieState });

        let req = request(app)
            .get(`/?code=${authCode}&state=${responseState}`)
            .set('Cookie', preExistingCookie);

        return setCommonExpectations(req)
            .then(function(res) {
                assert.include(res.text, 'id="error-message"');
                assert.include(res.text, cookieState);
                assert.include(res.text, responseState);
                assert.notInclude(res.text, authCode);
            });
    });

    it('handles valid authorization response properly', function() {
        const state = 'state_262f09a9-759e-4af4-8597-b9063ed501d9';
        const authCode = 'authCode_b856d2f1-f442-446a-b7db-07a5f1dc20df';

        const preExistingCookie = createCookieString({ state: state });
        const responseCookie = new RegExp(
            createCookieString({
                state: state,
                authCode: authCode,
                focus: 'user-tokens'
            })
        );

        let req = request(app)
            .get(`/?code=${authCode}&state=${state}`)
            .set('Cookie', preExistingCookie);

        return setCommonExpectations(req)
            .expect('set-cookie', /httponly/i)
            .expect('set-cookie', responseCookie)
            .then(function(res) {
                assert.notInclude(res.text, 'id="error-message"');
                assert.include(res.text, authCode);
            });
    });
});

function setCommonExpectations(req) {
    return req
        .expect(200)
        .expect('set-cookie', /_csrf=.*?/)
        .expect('x-frame-options', /^deny$/i);
}
