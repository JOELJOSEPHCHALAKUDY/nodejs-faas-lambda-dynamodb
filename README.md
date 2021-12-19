# Serverless ISD lead management App

A Simple lead management system developed as a FaaS ( Function as a Service ) using Nodejs , Aws Lambda, DynamoDb in typescript

## Installation

You will need the following packages installed locally,

- AWS CLI
- Node JS (16 or higher)
- Yarn

## Local Development

Before starting local development you will need to run a couple of commands in separate bash windows,

```bash
yarn global add serverless
yarn install
serverless dynamodb install
```

This will install DynamoDB locally.

Note: If you're running `aws` for the first time, run `aws configure` once to avoid errors.

You will need to setup environment variables, to do this copy the `.env.example` to `.env`.

You can start the local DynamoDB, migrate tables and simulate lambda and API endpoints locally using
the following command.

```bash
serverless offline start
```

Open a browser and go to the url [http://localhost:8008/shell](http://localhost:8008/shell) to access the web shell for dynamodb local.

See more information on [DynamoDB Local](https://www.npmjs.com/package/serverless-dynamodb-local) advanced options and configuration.

#### Local Endpoints

##### Leads

`POST create lead -`
[http://localhost:3000/dev/lead/create](http://localhost:3000/dev/lead/create)

`POST Get lead and interest -`
[http://localhost:3000/dev/lead](http://localhost:3000/dev/lead)

`POST update lead -`
[http://localhost:3000/dev/lead/update](http://localhost:3000/dev/lead/update)

`POST Get all leads -`
[http://localhost:3000/dev/lead/list](http://localhost:3000/dev/lead/list)

##### Interests

`POST create interest -`
[http://localhost:3000/dev/interest/create](http://localhost:3000/dev/interest/create)

`POST Get interest -`
[http://localhost:3000/dev/interest](http://localhost:3000/dev/interest)

`POST update interest -`
[http://localhost:3000/dev/interest/update](http://localhost:3000/dev/interest/update)

##### Forms

`POST Submit leads Form`
[http://localhost:3000/dev/form/lead-form](http://localhost:3000/dev/form/lead-form)

## Note

For this demo application, you need to create a token-based Lambda authorizer using the third-party identity provider Auth0, Sign up to Auth0 for free and then the CREATE API project to get the credentilas and then copy it to .env

```
/ .env
JWKS_URI="<JWKS-VA>"
AUDIENCE="<AUDIENCE-VALUE>"
TOKEN="<JWT-TOKEN-VALUE>"
TOKEN_ISSUER="<ISSUER-VALUE>"
AUTH0_CLIENT_ID="<CLIENT-ID>"
AUTH0_CLIENT_SECRET="<CLIENT-SECRET>"
```
