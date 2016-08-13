var https = require('https');
var selfSigned = require('openssl-self-signed-certificate');

var app = require('./server');
var port = (process.env.PORT || 3000) + 1;

var options = {
    key: selfSigned.key,
    cert: selfSigned.cert
};

https.createServer(options, app).listen(port);
console.log(`HTTPS started on port ${port} (dev only).`);
