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
        state: "5ca0b32f-388b-4e24-a86c-64fd5b764ba3",
        tokenEndpoint: cookie.tokenEndpoint
    };
};

module.exports = {
    index: index
};
