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
});

function createCookieString(cookie) {
    if(cookie) { return "oAuth2ClientShell=" + JSON.stringify(cookie); }
    return "oAuth2ClientShell=";
}
