# Labs Bankid-Navet Api

This solution contains three different node.js/express apis.

- navet-bankid-server
- bankid-endpoint
- navet-endpoint

The bankid-endpoint- and navet-endpoint-projects only contain logic for direct integrations against Bankid and Navet and should only be updated when Bankid or Navet change their own api:s. 

The navet-bankid-server-project contains logic connecting the other api:s to combine authentication against Bankid and userdata fetching from Navet in one flow. This is where all the custom logic should be written.

When developing against these api:s only navet-bankid-server is used.

## Development

All the api:s are built on Node.js and Express and are created with this <a href="https://github.com/helsingborg-stad/labs-node-js-boilerplate">boilerplate</a>. For instructions on how to run the project and other tech-related information please visit the link.

The specific .env-parameters required for these projects are:

- navet-bankid-server
  - NAVETURL (url for the navet-endpoint)
  - BANKIDURL (url for the bankid-endpoint)
- bankid-endpoint
  - BANKID_CA (path to the ca-file for bankid)
  - BANKID_PFX_PATH (path to the pfx-file for bankid) 
  - BANKID_API_URL (url for the bankid api)
  - BANKID_PASSPHRASE (passphrase for the bankid api)
- navet-endpoint
  - komACrt (path to the navet crt-file)
  - komAKey (path to the navet key-file)
  - passphrase (passphrase for the navet api)

## Bankid
To use the bankid test api you need to create a test-id via bankid and set it up on a phone, further instructions can be found on their official docs. If you want to bypass this step while developing there is function named authenticateWithBankId that can be changed to bypassBankid. This will skip the call to bankid and return hardcoded user data, which can be useful while developing.

## Navet
On their test-api, Navet has a limited number of test-"personal id numbers" that return actual data. To see which ones you can read the offical docs.
