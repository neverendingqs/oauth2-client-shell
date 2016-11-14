module.exports = {
    createCookieString: function(cookie) {
        if(cookie) {
            return "oAuth2ClientShell="
                // https://github.com/expressjs/express/issues/2815
                + encodeURIComponent("j:" + JSON.stringify(cookie));
            }
        return "oAuth2ClientShell=";
    }
};
