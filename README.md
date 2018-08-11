# OAuth2 Client Shell

[![Build Status](https://travis-ci.org/neverendingqs/oauth2-client-shell.svg?branch=master)](https://travis-ci.org/neverendingqs/oauth2-client-shell)
[![](https://images.microbadger.com/badges/image/neverendingqs/oauth2-client-shell.svg)](https://microbadger.com/images/neverendingqs/oauth2-client-shell "Get your own image badge on microbadger.com")

A client mock where the user provides the information to initiate the [OAuth2 authorization flow](https://tools.ietf.org/html/rfc6749#section-4). Hosted on https://oauth2-client-shell.herokuapp.com/.

This app always assumes it has HTTPS terminated in front of a load balancer, and that it can be trusted (i.e. `app.enable('trust proxy');`).

## Running

```sh
npm install

# Running in production and/or without HTTPS
npm start

# Running it with a self-signed certificate for local use only
npm run dev
```

This app is also available as a [container](https://hub.docker.com/r/neverendingqs/oauth2-client-shell/).

```sh
# Running it using docker-compose with a self-signed certificate for local use only
docker-compose up
```

Navigate to http://localhost:3000 for the HTTP endpoint, and https://localhost:3001 for the HTTPS endpoint.

### Environment Variables

All environment variables are optional. They allow you to pre-populate fields on initial page load.

The environment variables are:

* DEFAULT_AUTH_CODE_SCOPE
* DEFAULT_AUTH_ENDPOINT
* DEFAULT_CLIENT_ID
* DEFAULT_CLIENT_SECRET
* DEFAULT_CUSTOM_PARAMS
* DEFAULT_TOKEN_ENDPOINT

## Contributing

`npm run dev` will run the application with HTTPS and restart + jshint upon any js file changes. The HTTP port is based on the environment variable `PORT` (defaults to 3000), while the HTTPS port is `PORT + 1` (defaults to 3001)

 Include a `.env` file to automatically set environment variables while running locally. Example:

```
DEFAULT_AUTH_CODE_SCOPE=profile
DEFAULT_AUTH_ENDPOINT=https://accounts.google.com/o/oauth2/v2/auth
DEFAULT_CLIENT_ID=812741506391.apps.googleusercontent.com
DEFAULT_CLIENT_SECRET=abc123
DEFAULT_CUSTOM_PARAMS=access_type=online
DEFAULT_TOKEN_ENDPOINT=https://www.googleapis.com/oauth2/v4/token
```
