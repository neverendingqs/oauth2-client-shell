function resetPage() {
    var endpoint = encodeURI(location.protocol + '//' + location.host + "/?reset=true");
    location.assign(endpoint);
};

function getAuthCode() {
    var authEndpoint = document.getElementById("auth-code-auth-endpoint").value;
    var clientId = document.getElementById("auth-code-client-id").value;
    var scope = document.getElementById("auth-code-scope").value;

    var endpoint = encodeURI(
        location.protocol + '//' + location.host + "/auth"
            + "?auth_endpoint=" + authEndpoint
            + "&client_id=" + clientId
            + "&scope=" + scope
    );

    location.assign(endpoint);
};

function getTokens() {
    var tokenEndpoint = document.getElementById("user-tokens-token-endpoint").value;
    var authCode = document.getElementById("user-tokens-auth-code").value;
    var clientId = document.getElementById("user-tokens-client-id").value;
    var clientSecret = document.getElementById("user-tokens-client-secret").value;

    var endpoint = encodeURI(
        location.protocol + '//' + location.host + "/token"
            + "?token_endpoint=" + tokenEndpoint
            + "&auth_code=" + authCode
            + "&client_id=" + clientId
            + "&client_secret=" + clientSecret
    );

    location.assign(endpoint);
};
