const assert = require('chai').assert;
const request = require('supertest');

const app = require('../../src/server');

const getCsrfTokens = require('../utils').getCsrfTokens;

const routes = [
    '/auth',
    '/token',
    '/refresh'
];

describe('rejects form submissions without valid csrf token(s)', function() {
    routes.forEach(function(route) {
        describe(route, function() {
            describe('request missing csrf token', function() {
                it('in cookie', function(done) {
                    getCsrfTokens(function(cookieCsrf, formCsrf) {
                        request(app)
                            .post(route)
                            .type('form')
                            .send({
                                _csrf: formCsrf,
                                client_id: 'client_id'
                            })
                            .expect(403, done);
                    });
                });

                it('in body', function() {
                    getCsrfTokens(function(cookieCsrf, formCsrf) {
                        request(app)
                            .post(route)
                            .set('Cookie', `_csrf=${cookieCsrf}`)
                            .type('form')
                            .send({ client_id: 'client_id' })
                            .expect(403, done);
                    });
                });

                it('in cookie and body', function(done) {
                    request(app)
                        .post(route)
                        .type('form')
                        .send({ client_id: 'client_id' })
                        .expect(403, done);
                });
            });
        });
    });
});
