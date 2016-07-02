var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('index');
});

app.listen(port);
console.log(`Started on port ${port}.`);
