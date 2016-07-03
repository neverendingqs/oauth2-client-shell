var cookieName = "oAuth2ClientShell";

var express = require('express');
var cookieParser = require('cookie-parser')
var request = require('superagent');

var port = process.env.PORT || 3000;
var cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
};

var app = express();
app.set('view engine', 'ejs');

app.use(cookieParser())
app.use(express.static('public'));

app.get('/', function(req, res) {
    var cookie;

    if (req.query.reset === "true") {
        res.cookie(cookieName, "", { expires: new Date() });
        cookie = {};
    } else {
        cookie = req.cookies[cookieName] || {};
        cookie.authCode = req.query.code || cookie.authCode;
    }

    var locals = {
        authCode: cookie.authCode,
        authEndpoint: cookie.authEndpoint,
        clientId: cookie.clientId,
        scope: cookie.scope,
        tokenEndpoint: cookie.tokenEndpoint,
        clientSecret: cookie.clientSecret,
        accessToken: cookie.accessToken,
        refreshToken: cookie.refreshToken
    };

    res.render('index', locals);
});

app.get('/auth', function(req, res) {
    var cookie = req.cookies[cookieName] || {};
    cookie.authEndpoint = req.query.auth_endpoint;
    cookie.clientId = req.query.client_id;
    cookie.scope = req.query.scope;
    res.cookie(cookieName, cookie, cookieOptions);

    var authCodeRequest = cookie.authEndpoint
        + "?response_type=code"
        + "&redirect_uri=" + req.protocol + "://" + req.headers.host + "/"
        + "&client_id=" + cookie.clientId
        + "&scope=" + cookie.scope;

    res.redirect(authCodeRequest);
});

app.get('/token', function(req, res) {
    var cookie = req.cookies[cookieName] || {};
    cookie.tokenEndpoint = req.query.token_endpoint;
    cookie.authCode = req.query.auth_code;
    cookie.clientId = req.query.client_id;
    cookie.clientSecret = req.query.client_secret;
    res.cookie(cookieName, cookie, cookieOptions);

    var payload = {
        grant_type: "authorization_code",
        redirect_uri: req.protocol + "://" + req.headers.host + "/",
        client_id: cookie.clientId,
        client_secret: cookie.clientSecret,
        code: cookie.authCode
    };

    request.post(cookie.tokenEndpoint)
        .type('form')
        .send(payload)
        .end(function(err, postResponse) {
            if (err) {
                console.log("Error trading in authorization code:")
                console.log(err);
                // TODO: return with proper error message
            }

            cookie.accessToken = postResponse.body.access_token;
            cookie.refreshToken = postResponse.body.refresh_token || "Not provided by token endpoint.";
            res.cookie(cookieName, cookie, cookieOptions);

            var locals = {
                authCode: cookie.authCode,
                authEndpoint: cookie.authEndpoint,
                clientId: cookie.clientId,
                scope: cookie.scope,
                tokenEndpoint: cookie.tokenEndpoint,
                clientSecret: cookie.clientSecret,
                accessToken: cookie.accessToken,
                refreshToken: cookie.refreshToken
            };

            res.render('index', locals);
        })
});

app.listen(port);
console.log(`Started on port ${port}.`);
console.log(`Running with cookieOptions.secure == ${cookieOptions.secure}.`);
