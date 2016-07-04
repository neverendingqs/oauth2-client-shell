# OAuth2 Client Shell

A client mock where the user provides the information to initiate the [OAuth2 authorization flow](https://tools.ietf.org/html/rfc6749#section-4). Hosted on https://oauth2-client-shell.herokuapp.com/.

Note: this app always assumes it has HTTPS terminated in front of a load balancer, and that it can be trusted (i.e. `app.enable('trust proxy');`).
