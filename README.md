# Labs Bankid Api
Api for authentification and Signature with Bank Id; 

## Development

All the api:s are built on Node.js and Express and are created with this <a href="https://github.com/helsingborg-stad/labs-node-js-boilerplate">boilerplate</a>. For instructions on how to run the project and other tech-related information please visit the link.

The specific .env-parameters required for these projects are:

1. Clone repository
2. Install dependencies with npm install
3. Create .env-file in the root folder with these properties
````
   PORT=3004 #(or any other port you prefer)
   LOG_LEVEL=info #(trace, debug, info, warn, error, fatal, silent)

  - BANKID_CA (path to the ca-file for bankid)
  - BANKID_PFX_PATH (path to the pfx-file for bankid) 
  - BANKID_API_URL (url for the bankid api)
  - BANKID_PASSPHRASE (passphrase for the bankid api)
````
4. run ```npm run migrate:latest``` (this will migrate your mysql schemas to the latest version)
5. Run project with ```npm run dev```

## Bankid
To use the bankid test api you need to create a test-id via bankid and set it up on a phone, further instructions can be found on their official docs.

### Tests

The project uses [mocha](https://mochajs.org/) + [chai](https://www.chaijs.com/) for testing.

Running tests:

1. Create .env.test-file in the root folder with same settings as the regular .env but with a different port.
2. Run the command ```npm run test```

To run the tests on code-changes, use ```npm run test:watch```

All files following the *.test.js-syntax will be included.

## Deployment
TODO

## Docker

This app can be built using [docker](https://www.docker.com/). To do so, simply navigate to the root of the project and run:

```
docker build . -t [tag] && \
docker run -d \
-p [host-port]:[server-port] \
-e PORT=[server-port] \
-e SERVER_KEY=./assets/certificates/server.key \
-e SERVER_CERT=./assets/certificates/server.cert \
[tag]
```

Further, you can thus use [docker-compose](https://docs.docker.com/compose/) to orchestrate containers created from this repository (and other dockerized apps). When developing, we use [this](https://github.com/helsingborg-stad/labs-docker-compose) specific docker-compose file.