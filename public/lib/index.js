function getAuthCode() {
    var authEndpoint = document.getElementById("auth-code-auth-endpoint").value;
    var clientId = document.getElementById("auth-code-client-id").value;
    var scope = document.getElementById("auth-code-scope").value;

    var authCodeEndpoint = encodeURI(
        location.protocol + '//' + location.host + "/auth"
            + "?auth_endpoint=" + authEndpoint
            + "&client_id=" + clientId
            + "&scope=" + scope
    );

    location.assign(authCodeEndpoint);
};
