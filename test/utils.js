const request = require('supertest-as-promised');

const app = require('../src/server');

function createCookieString(cookie) {
    if(cookie) {
        return "oAuth2ClientShell="
            // https://github.com/expressjs/express/issues/2815
            + encodeURIComponent("j:" + JSON.stringify(cookie));
        }
    return "oAuth2ClientShell=";
}

function getCsrfTokens() {
    return request(app)
        .get('/')
        .expect('set-cookie', /_csrf=.*?[;,]/)
        .expect(/name="_csrf" value="(.*?)"/)
        .then(function(res) {
            const cookieCsrf = /_csrf=(.*?);/.exec(res.headers['set-cookie'])[1];
            const formCsrf = /name="_csrf" value="(.*?)"/.exec(res.text)[1];
            return {
                cookie: cookieCsrf,
                form: formCsrf
            };
        });
}

function formPostRequestWithCsrf(endpoint, payload) {
    return getCsrfTokens().then(function(csrf) {
        payload._csrf = csrf.form;
        return request(app)
            .post(endpoint)
            .set('Cookie', `_csrf=${csrf.cookie}`)
            .type('form')
            .send(payload);
    });
}

module.exports = {
    createCookieString: createCookieString,
    getCsrfTokens: getCsrfTokens,
    formPostRequestWithCsrf: formPostRequestWithCsrf
};
