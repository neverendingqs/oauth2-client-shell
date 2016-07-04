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
        customParams: cookie.customParams,
        state: "5ca0b32f-388b-4e24-a86c-64fd5b764ba3",
        focus: cookie.focus || "auth-code",
        error: error
    };
};

module.exports = {
    index: index
};
