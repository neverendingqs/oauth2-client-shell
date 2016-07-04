function clearCodeAndTokens() {
    var endpoint = encodeURI(location.protocol + '//' + location.host + "/?clear=true");
    location.assign(endpoint);
};

function resetPage() {
    var endpoint = encodeURI(location.protocol + '//' + location.host + "/?reset=true");
    location.assign(endpoint);
};
