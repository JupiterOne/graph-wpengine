# Development

This integration focuses on [WordPress Engine](https://wpengine.com/) and is
using [WP Engine API](https://wpengineapi.com/) for interacting with the WP
Engine resources.

## Provider account setup

Sign-up for an account on [WordPress Engine](https://wpengine.com/) and generate
the API credentials.

## Authentication

In order to use [WP Engine API](https://wpengineapi.com/) the requests must
supply authorization credentials. This integration does it by including
Authorization header using a Base64 of the API credential's "username:password".

Create a `.env` file at the root of this project, and set the variables to your
API credentials. See [.env.example](../.env.example) for reference.

After following the above steps, you should now be able to start contributing to
this integration. The integration will pull in the WP_ENGINE_USERNAME and
WP_ENGINE_PASSWORD variables from the .env file and use them when making
requests.
