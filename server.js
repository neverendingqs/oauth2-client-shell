var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    var locals = {
        auth_code: req.query.code
    };

    res.render('index', locals);
});

app.get('/auth', function(req, res) {
    var authCodeRequest = req.query.auth_endpoint
        + "?response_type=code"
        + "&client_id=" + req.query.client_id
        + "&redirect_uri=" + req.query.redirect_uri
        + "&scope=" + req.query.scope;

    res.redirect(authCodeRequest);
});

app.listen(port);
console.log(`Started on port ${port}.`);
