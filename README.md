# OAuth2 Client Shell

A client mock where the user provides the information to initiate the [OAuth2 authorization flow](https://tools.ietf.org/html/rfc6749#section-4). Hosted on https://oauth2-client-shell.herokuapp.com/.

Notes:

* This app always assumes it has HTTPS terminated in front of a load balancer, and that it can be trusted (i.e. `app.enable('trust proxy');`)
* Additionally, if this app is running locally, the HTTP port is based on the environment variable `PORT` (defaults to 3000), while the HTTPS port is `PORT + 1` (defaults to 3001)
