module.exports = {
    getRedirectUri: function(req) {
        return req.protocol + "://" + req.headers.host + "/";
    },

    cookieFromDefaults: function() {
        return {
            authCodeScope: process.env.DEFAULT_AUTH_CODE_SCOPE,
            authEndpoint: process.env.DEFAULT_AUTH_ENDPOINT,
            clientId: process.env.DEFAULT_CLIENT_ID,
            clientSecret: process.env.DEFAULT_CLIENT_SECRET,
            customParams: process.env.DEFAULT_CUSTOM_PARAMS,
            tokenEndpoint: process.env.DEFAULT_TOKEN_ENDPOINT
        };
    }
};
