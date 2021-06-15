const axios = require('axios');

module.exports = {
  name: 'Transmute',
  getHeaders: async () => {
    // Get oauth2 access token using client_credentials flow
    const data = {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      // audience: 'https://staging.platform.transmute.industries',
      // audience: 'http://localhost:8080',
      audience: process.env.AUDIENCE,
      grant_type: 'client_credentials',
    };
    const auth0Domain = process.env.DOMAIN;
    const oauthResponse = await axios({
      method: 'POST',
      url: `https://${auth0Domain}/oauth/token`,
      headers: {
        'content-type': 'application/json',
      },
      data,
    });
    const accessToken = oauthResponse.data.access_token;
    return {
      Authorization: `Bearer ${accessToken}`,
    };
  },
  getQueryParams: async () => {
    return {
      role: 'http://localhost:8080/organizations/a1664189-094f-4546-a767-fff1602638a3/admin',
    };
  },
  issueCredentialConfiguration: [
    {
      id: 'did:key:z6MkpRgwMo1tSopyz5RZD131SpkZ1tAb5pvZcs76eBe9hQRK',
      endpoint:
        'http://localhost:8080/v1/organizations/a1664189-094f-4546-a767-fff1602638a3/credentials/issue',
      proofType: 'Ed25519Signature2018',
      options: {
        assertionMethod:
          'did:key:z6MkpRgwMo1tSopyz5RZD131SpkZ1tAb5pvZcs76eBe9hQRK#z6MkpRgwMo1tSopyz5RZD131SpkZ1tAb5pvZcs76eBe9hQRK',
      },
    },
  ],
  verifyCredentialConfiguration: {
    // endpoint: "https://vc.transmute.world/next/credentials/verify",
    // endpoint: "http://localhost:8080/v1/organizations/52628a04-cc54-4570-9940-36133d606ab6/credentials/verify",
    endpoint:
      'https://staging.platform.transmute.industries/v1/organizations/eaff306f-2591-4d02-a08c-410574e9c861/credentials/verify',
    didMethodsSupported: ['did:key:'],
    linkedDataProofSuitesSupported: [
      'Ed25519Signature2018',
      'BbsBlsSignature2020',
      'BbsBlsSignatureProof2020',
    ],
  },
  verifyPresentationConfiguration: {
    // endpoint: "https://vc.transmute.world/next/presentations/verify",
    // endpoint: "http://localhost:8080/v1/organizations/52628a04-cc54-4570-9940-36133d606ab6/presentations/verify",
    endpoint:
      'https://staging.platform.transmute.industries/v1/organizations/eaff306f-2591-4d02-a08c-410574e9c861/presentations/verify',
    didMethodsSupported: ['did:key:'],
    linkedDataProofSuitesSupported: [
      'Ed25519Signature2018',
      'BbsBlsSignature2020',
      'BbsBlsSignatureProof2020',
    ],
  },
  credentials: require('../__fixtures__/credentials'),
  verifiableCredentials: require('../__fixtures__/verifiableCredentials'),
  verifiablePresentations: require('../__fixtures__/verifiablePresentations'),
};
