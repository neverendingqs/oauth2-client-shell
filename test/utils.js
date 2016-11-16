const request = require('supertest');

const app = require('../src/server');

function createCookieString(cookie) {
    if(cookie) {
        return "oAuth2ClientShell="
            // https://github.com/expressjs/express/issues/2815
            + encodeURIComponent("j:" + JSON.stringify(cookie));
        }
    return "oAuth2ClientShell=";
}

function getCsrfTokens(cb) {
    request(app)
        .get('/')
        .expect('set-cookie', /_csrf=.*?[;,]/)
        .expect(/name="_csrf" value="(.*?)"/)
        .end(function(err, res) {
            if (err) return done(err);

            const cookieCsrf = /_csrf=(.*?);/.exec(res.headers['set-cookie'])[1];
            const formCsrf = /name="_csrf" value="(.*?)"/.exec(res.text)[1];
            cb(cookieCsrf, formCsrf);
    });
}

module.exports = {
    createCookieString: createCookieString,
    getCsrfTokens: getCsrfTokens
};
