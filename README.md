# OAuth2 Client Shell

[![Greenkeeper badge](https://badges.greenkeeper.io/neverendingqs/oauth2-client-shell.svg)](https://greenkeeper.io/)

A client mock where the user provides the information to initiate the [OAuth2 authorization flow](https://tools.ietf.org/html/rfc6749#section-4). Hosted on https://oauth2-client-shell.herokuapp.com/.

This app always assumes it has HTTPS terminated in front of a load balancer, and that it can be trusted (i.e. `app.enable('trust proxy');`)

## Running

```
npm start
```

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
