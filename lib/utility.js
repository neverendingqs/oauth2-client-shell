module.exports = {
    getRedirectUri: function(req) {
        return req.protocol + "://" + req.headers.host + "/";
    }
};
