module.exports = {
  name: "Transmute",
  issueCredentialConfiguration: [
    {
      id: "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd",
      endpoint: "https://vc.transmute.world/next/credentials/issue",
      proofType: "Ed25519Signature2018",
      options: {
        assertionMethod:
          "did:key:z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd#z6MkjRagNiMu91DduvCvgEsqLZDVzrJzFrwahc4tXLt9DoHd",
      },
    },
    {
      id:
        "did:key:z5TcF9K5jTimwCWUpfkkPzdvF9xSPjRcvdMqeYWy6grZhbm8CoAdR1vos6rQzrLjm1oCjD7hoxknNk2BMrpoC8iUpAZswGm2BrkoxsNUqVFtfoNBdCtFCXduzeYZZDs5sJzdsgktZzPRfRLRGnwCV4trjYqpRZa4TYQeWG2e6HqpLynmcx3SJLuEZ2YnCdJHznRA3Ayyt",
      endpoint: "https://vc.transmute.world/next/credentials/issue",
      proofType: "BbsBlsSignature2020",
      options: {
        assertionMethod:
          "did:key:z5TcF9K5jTimwCWUpfkkPzdvF9xSPjRcvdMqeYWy6grZhbm8CoAdR1vos6rQzrLjm1oCjD7hoxknNk2BMrpoC8iUpAZswGm2BrkoxsNUqVFtfoNBdCtFCXduzeYZZDs5sJzdsgktZzPRfRLRGnwCV4trjYqpRZa4TYQeWG2e6HqpLynmcx3SJLuEZ2YnCdJHznRA3Ayyt#zUC75ReHuHnjbU5w4XNgrU13ZR6GN1JxVVwWyNkijuvG49A19Bg7XMqQhNoYZjB7v9nRdZfNqJcusvkhvUZjK4FoikAdRUjgF9Komr6XwfLjDfhgenBTHxfhM85d7z5rJRcKnZQ",
      },
    },
  ],
  verifyCredentialConfiguration: {
    // endpoint: "https://vc.transmute.world/next/credentials/verify",
    // endpoint: "http://localhost:8080/v1/organizations/52628a04-cc54-4570-9940-36133d606ab6/credentials/verify",
    endpoint: "https://staging.platform.transmute.industries/v1/organizations/eaff306f-2591-4d02-a08c-410574e9c861/credentials/verify",
    didMethodsSupported: ["did:key:"],
    linkedDataProofSuitesSupported: [
      "Ed25519Signature2018",
      "BbsBlsSignature2020",
      "BbsBlsSignatureProof2020",
    ],
  },
  verifyPresentationConfiguration: {
    // endpoint: "https://vc.transmute.world/next/presentations/verify",
    // endpoint: "http://localhost:8080/v1/organizations/52628a04-cc54-4570-9940-36133d606ab6/presentations/verify",
    endpoint: "https://staging.platform.transmute.industries/v1/organizations/eaff306f-2591-4d02-a08c-410574e9c861/presentations/verify",
    didMethodsSupported: ["did:key:"],
    linkedDataProofSuitesSupported: [
      "Ed25519Signature2018",
      "BbsBlsSignature2020",
      "BbsBlsSignatureProof2020",
    ],
  },
  credentials: require("../__fixtures__/credentials"),
  verifiableCredentials: require("../__fixtures__/verifiableCredentials"),
  verifiablePresentations: require("../__fixtures__/verifiablePresentations"),
};
