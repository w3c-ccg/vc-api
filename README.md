# [Verifiable Credential API](https://github.com/w3c-ccg/vc-api/) Goals

The W3C Credentials Community Group Verifiable Credential APIs are a set of
RESTful API definitions conforming with the [OpenAPI 3.0
Specification](https://swagger.io/specification/v3/) that support Verifiable
Credential Lifecycle Management such as Issuing, Holding/Presentation/Exchange,
and Verification for the roles of Issuer, Holder, and Verifier as described in
the [Verifiable Credential Data Model](https://www.w3.org/TR/vc-data-model-2.0/)
specification.

These APIs provide a standard set of interfaces by which interoperability may be
tested and verified by various parties who leverage Verifiable Credentials
(VCs).

You can view the latest version of the specification here:

[The Verifiable Credential API](https://w3c-ccg.github.io/vc-api/)

As some implementations might not support all endpoints defined by this
specification, the APIs provide a clean measure by which to identify which
methods are or are not implemented when comparing solutions that provide VC
support across vendors.

Test procedures and specifications are provided as part of this API definition
to allow for repeatable and automated interoperability testing between solutions
that interact with Verifiable Credentials. Some of these tests suites include:

* [VC API Issuer Test Suite](https://w3c-ccg.github.io/vc-api-issuer-test-suite/)
* [VC API Verifier Test Suite](https://w3c-ccg.github.io/vc-api-verifier-test-suite/)
* [EdDSA Test Suite](https://w3c.github.io/vc-di-ed25519signature2020-test-suite/)
* [Status List 2021 Test Suite](https://w3c-ccg.github.io/status-list-2021-test-suite/)

## Style, Versioning, and Contribution
This API is versioned in conformance with the [Semantic Versioning 2.0
specification](https://semver.org/) to prevent breaking changes between minor
versions, and to allow for reliable testing and integration of implementations
of this API within enterprise environments.

API style, endpoint naming, and object definitions within the vc-api should be
in compliance with the guidelines laid out in the [REST API
Tutorial](https://restfulapi.net/).  The VC API conforms primarily to the
[controller](https://restfulapi.net/resource-naming/) model as detailed in the
REST documentation.

The actual standard and specification defined by the VC-API is provided in YAML
format and should be referenced directly by developers should questions arise,
as certain interfaces on top of OpenAPI specifications may differ in their
presentation of certain scenarios commonly encountered in API definitions,
especially when dealing with `nullable` parameters or properties.

Contributions to this repository should take place via [pull
requests](https://github.com/w3c-ccg/vc-api/pulls), and should generally
reference an issue and related discussion around the topic

## Best Practices

### Security

Implementations of this API SHOULD NOT be exposed directly over http(s) without
authorization. Best Practices around OAuth and other widely accepted standards
for authentication and/or authorization should be followed.

### Holder APIs

Holder APIs are optional as many implementations will not need them, however
they are extremely useful for testing purposes as well as for cases where WebKMS
is not present or not an option.

## Public Meetings

The editors host an open community call using W3C-CCG meeting infrastructure.
This entails:
- Proposed agendas and supplemental materials for review are sent out by any
  regularly-participating member to the [CCG mailing
  list](https://lists.w3.org/Archives/Public/public-credentials/); editors and
  CCG chairs reserve the right to  adjudicate if conflicting, inappropriate, or
  contentious agenda proposals are put forward.
- Mostly-audio calls hosted on a CCG [Jitsi
  room](https://meet.w3c-ccg.org/vcapi), Tuesdays at 4pm Eastern Time. This
  allows members to screenshare during issue review or discussion of diagrams.
- Minutes are scribed by volunteers from the group and sent to the CCG mailing
  list for review.

### Development

Before committing changes to the OpenAPI spec files, please be sure to run the linter and correct any errors:

```bash
npm ci
npm run lint
```

To assemble bundled `yaml` files, as well as an all-in-one bundle of all definitions,
run the following:

```bash
npm ci
npm run build
```

This will generate the following files:

- `api/vc-api.yaml` - a bundle with all specifications rolled into one
- `api/bundles/issuer.yml` - issuer endpoints bundled with no external refs
- `api/bundles/verifier.yml` - verifier endpoints bundled with no external refs
- `api/bundles/holder.yml` - holder endpoints bundled with no external refs

To view the generated specifications, execute `npm run serve`. By default, this will start an http server on http://127.0.0.1:8080. Once you have the server started, you can view the documentation in several formats:

- [RapiDoc](http://127.0.0.1:8080/rapidoc.html)
- [Redocly](http://127.0.0.1:8080/redoc.html)
- [Swagger](http://127.0.0.1:8080/swagger.html)

To view changes to the related to the `index.html`, execute `npm run serveIndex`. By default this will start an http server on http://127.0.0.1:8080. Once you have the server started, you can view the `index.html` here:

- [index.html](http://127.0.0.1:8080/index.html)

You can can view the documentation here:

- [RapiDoc](http://127.0.0.1:8080/api/rapidoc.html)
- [Redocly](http://127.0.0.1:8080/api/redoc.html)
- [Swagger](http://127.0.0.1:8080/api/swagger.html)

Documentation for the [`http-server` can be found here.](https://www.npmjs.com/package/http-server)

If you need to run on another port, execute `npm run serveIndex -- -p 4543` replacing `4543` with a custom port.

## Additional Documentation

- [Verifiable Credentials Data Model](https://w3c.github.io/vc-data-model/)
- [Presentation Request](https://w3c-ccg.github.io/vp-request-spec/)
- [Data Integrity](https://w3c.github.io/vc-data-integrity/)
- [Bitstring Status List](https://w3c.github.io/vc-bitstring-status-list/) (formerly known as <i>Status List 2021</i>)
