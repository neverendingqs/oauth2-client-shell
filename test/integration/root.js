const assert = require('chai').assert;
const request = require('supertest');

const app = require('../../src/server');

describe('GET /', function() {
    it('initial load includes csrf token', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .expect('set-cookie', /_csrf=.*?; Path=\//, done);
    });

    it('reset parameter resets cookie', function(done) {
        const preExistingCookie = createCookieString({ foo: "bar" });
        const responseCookie = new RegExp(createCookieString() + "; Path=/");

        request(app)
            .get('/?reset=true')
            .set('Cookie', preExistingCookie)
            .expect(200)
            .expect('set-cookie', responseCookie, done);
    });

    it('clear parameter clears certain cookie values', function(done) {
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
            + "; Path=/"
        );

        request(app)
            .get('/?clear=true')
            .set('Cookie', preExistingCookie)
            .expect(200)
            .expect('set-cookie', responseCookie, done);
    });

    it('displays an error if the the state doesn\'t match the state in the authorization response', function(done) {
        const cookieState = 'cookieState_e578ec8c-561e-49ee-8a92-0f369006b001';
        const responseState = 'responseState_960b7de7-19e5-44f0-8b8d-dba65e26e186';
        const authCode = 'authCode_6f9b363c-1f52-4d4e-90aa-9ca99a546641';

        const preExistingCookie = createCookieString({ state: cookieState });

        request(app)
            .get(`/?code=${authCode}&state=${responseState}`)
            .set('Cookie', preExistingCookie)
            .expect(200)
            .end(function(err, res) {
                assert.include(res.text, 'id="error-message"');
                assert.include(res.text, cookieState);
                assert.include(res.text, responseState);
                assert.notInclude(res.text, authCode);
                done();
            });
    });

    it('handles valid authorization response properly', function(done) {
        const state = 'state_262f09a9-759e-4af4-8597-b9063ed501d9';
        const authCode = 'authCode_b856d2f1-f442-446a-b7db-07a5f1dc20df';

        const preExistingCookie = createCookieString({ state: state });

        request(app)
            .get(`/?code=${authCode}&state=${state}`)
            .set('Cookie', preExistingCookie)
            .expect(200)
            .end(function(err, res) {
                assert.notInclude(res.text, 'id="error-message"');
                assert.include(res.text, authCode);
                done();
            });
    });
});

function createCookieString(cookie) {
    if(cookie) {
        return "oAuth2ClientShell="
            // https://github.com/expressjs/express/issues/2815
            + encodeURIComponent("j:" + JSON.stringify(cookie));
        }
    return "oAuth2ClientShell=";
}
