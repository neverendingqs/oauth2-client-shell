var assert = require('chai').assert;
var request = require('supertest');

var app = require('../../src/server');

describe('GET /', function() {
    it('initial load', function(done) {
        request(app)
            .get('/')
            .expect(200)
            .expect('set-cookie', /_csrf=.*?; Path=\//, done);
    });

    it('reset parameter resets cookie', function(done) {
        var preExistingCookie = createCookieString({foo: "bar"});
        var responseCookie = new RegExp(createCookieString() + "; Path=/");

        request(app)
            .get('/?reset=true')
            .set('Cookie', preExistingCookie)
            .expect(200)
            .expect('set-cookie', responseCookie, done);
    });

    it('clear parameter clears certain cookie values', function(done) {
        var preExistingCookie = createCookieString({
            authCode: "authCode",
            authEndpoint: "authEndpoint",
            accessToken: "accessToken",
            refreshToken: "refreshToken",
            focus: "focus"
        });
        var responseCookie = new RegExp(
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
});

function createCookieString(cookie) {
    if(cookie) {
        return "oAuth2ClientShell="
            // https://github.com/expressjs/express/issues/2815
            + encodeURIComponent("j:" + JSON.stringify(cookie));
        }
    return "oAuth2ClientShell=";
}
