var rand = require('csprng');

var utility = require('./utility');

var index = function(req, cookie, error) {
    return {
        accessToken: cookie.accessToken,
        authCode: cookie.authCode,
        authCodeScope: cookie.authCodeScope,
        authEndpoint: cookie.authEndpoint,
        clientId: cookie.clientId,
        clientSecret: cookie.clientSecret,
        csrfToken: req.csrfToken(),
        customParams: cookie.customParams,
        error: error || req.query.error,
        focus: cookie.focus || "auth-code",
        redirectUri: utility.getRedirectUri(req),
        refreshToken: cookie.refreshToken,
        refreshTokenScope: cookie.refreshTokenScope,
        state: rand(256, 36),
        tokenEndpoint: cookie.tokenEndpoint
    };
};

module.exports = {
    index: index
};
