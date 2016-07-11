var cookieName = "oAuth2ClientShell";

var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csrf  = require('csurf');
var request = require('superagent');

var utility = require('./lib/utility');
var views = require('./lib/views');

var state = "5ca0b32f-388b-4e24-a86c-64fd5b764ba3";
var port = process.env.PORT || 3000;
var cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
};

var app = express();
app.set('view engine', 'ejs');
app.enable('trust proxy');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(csrf({ cookie: true }));
app.use(express.static('public'));

app.get('/', function(req, res) {
    var cookie = req.cookies[cookieName] || {};
    var error;

    if (req.query.reset === "true") {
        res.cookie(cookieName, "", { expires: new Date() });
        cookie = {};
    } else if (req.query.clear === "true") {
        cookie.authCode = null;
        cookie.accessToken = null;
        cookie.refreshToken = null;
        cookie.focus = null;
        res.cookie(cookieName, cookie, cookieOptions);
    } else if (req.query.state && req.query.state !== state) {
        error = `Authorization endpoint sent back the wrong state! Expected '${req.query.state} but got '${state}' from the server.`;
    } else if (req.query.code) {
        cookie.authCode = req.query.code;
        cookie.focus = "user-tokens";
    }

    res.render('index', views.index(req, cookie, error));
});

app.post('/auth', function(req, res) {
    var cookie = req.cookies[cookieName] || {};
    cookie.authEndpoint = req.body.auth_endpoint;
    cookie.clientId = req.body.client_id;
    cookie.scope = req.body.scope;
    cookie.customParams = req.body.custom_params;
    cookie.focus = "auth-code";
    cookie.authCode = null;
    res.cookie(cookieName, cookie, cookieOptions);

    var authCodeRequest = cookie.authEndpoint
        + "?response_type=code"
        + "&redirect_uri=" + utility.getRedirectUri(req)
        + "&client_id=" + cookie.clientId
        + "&scope=" + cookie.scope
        + "&state=" + state;

    if(cookie.customParams) {
        authCodeRequest += "&" + cookie.customParams;
    }

    res.redirect(authCodeRequest);
});

app.post('/token', function(req, res) {
    var cookie = req.cookies[cookieName] || {};
    cookie.tokenEndpoint = req.body.token_endpoint;
    cookie.authCode = req.body.auth_code;
    cookie.clientId = req.body.client_id;
    cookie.clientSecret = req.body.client_secret;
    cookie.focus = "user-tokens";
    cookie.accessToken = null;
    cookie.refreshToken = null;
    res.cookie(cookieName, cookie, cookieOptions);

    var payload = {
        grant_type: "authorization_code",
        redirect_uri: utility.getRedirectUri(req),
        code: cookie.authCode
    };

    request
        .post(cookie.tokenEndpoint)
        .auth(cookie.clientId, cookie.clientSecret)
        .type('form')
        .send(payload)
        .end(function(err, postResponse) {
            if (err) {
                var error = postResponse
                    ? postResponse.body || "Unknown error"
                    : "Unknown error";
                console.log("Error trading in authorization code:");
                console.log(err);
                res.redirect('/?error=' + JSON.stringify(error));
            } else {
                cookie.accessToken = postResponse.body.access_token;
                cookie.refreshToken = postResponse.body.refresh_token || "Not provided by token endpoint.";
                cookie.authCode = "(Used) " + cookie.authCode;
                cookie.focus = "refresh-token";
                res.cookie(cookieName, cookie, cookieOptions);

                res.redirect('/');
            }
        });
});

app.post('/refresh', function(req, res) {
    var cookie = req.cookies[cookieName] || {};
    cookie.tokenEndpoint = req.body.token_endpoint;
    cookie.refreshToken = req.body.refresh_token;
    cookie.clientId = req.body.client_id;
    cookie.clientSecret = req.body.client_secret;
    cookie.accessToken = null;
    res.cookie(cookieName, cookie, cookieOptions);

    var payload = {
        grant_type: "refresh_token",
        redirect_uri: req.protocol + "://" + req.headers.host + "/",
        refresh_token: cookie.refreshToken
    };

    request
        .post(cookie.tokenEndpoint)
        .auth(cookie.clientId, cookie.clientSecret)
        .type('form')
        .send(payload)
        .end(function(err, postResponse) {
            var error = postResponse
                    ? postResponse.body || "Unknown error"
                    : "Unknown error";
            if (err) {
                console.log("Error trading in refresh token:");
                console.log(err);
                res.redirect('/?error=' + JSON.stringify(error));
            } else {
                cookie.accessToken = postResponse.body.access_token;
                cookie.refreshToken = postResponse.body.refresh_token || cookie.refreshToken;
                cookie.focus = "refresh-token";
                res.cookie(cookieName, cookie, cookieOptions);

                res.redirect('/');
            }
        });
});

app.listen(port);
console.log(`HTTP started on port ${port}.`);
console.log(`Running with cookieOptions.secure == ${cookieOptions.secure}.`);

if (process.env.NODE_ENV !== 'production') {
    var https = require('https');
    var selfSigned = require('openssl-self-signed-certificate');

    var options = {
        key: selfSigned.key,
        cert: selfSigned.cert
    };

    https.createServer(options, app).listen(port + 1);
	console.log(`HTTPS started on port ${port + 1} (dev only).`);
}
