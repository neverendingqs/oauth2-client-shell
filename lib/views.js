var index = function(cookie, error) {
    return {
        authCode: cookie.authCode,
        authEndpoint: cookie.authEndpoint,
        clientId: cookie.clientId,
        scope: cookie.scope,
        tokenEndpoint: cookie.tokenEndpoint,
        clientSecret: cookie.clientSecret,
        accessToken: cookie.accessToken,
        refreshToken: cookie.refreshToken,
        error: error
    };
};

module.exports = {
    index: index
};
