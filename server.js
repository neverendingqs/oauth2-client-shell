var cookieName = "oAuth2ClientShell";

var express = require('express');
var cookieParser = require('cookie-parser')

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
        scope: cookie.scope
    };

    res.render('index', locals);
});

app.get('/auth', function(req, res) {
    var cookie = req.cookies[cookieName] || {};
    cookie.authEndpoint = req.query.auth_endpoint;
    cookie.clientId = req.query.client_id;
    cookie.scope = req.query.scope;

    res.cookie(cookieName, cookie, cookieOptions);

    var authCodeRequest = req.query.auth_endpoint
        + "?response_type=code"
        + "&redirect_uri=" + req.protocol + "://" + req.headers.host + "/"
        + "&client_id=" + req.query.client_id
        + "&scope=" + req.query.scope;

    res.redirect(authCodeRequest);
});

app.listen(port);
console.log(`Started on port ${port}.`);
console.log(`Running with cookieOptions.secure == ${cookieOptions.secure}.`);
