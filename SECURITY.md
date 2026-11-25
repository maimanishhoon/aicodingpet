# Security baseline

- API keys are backend environment variables only; do not add them to web or extension configuration.
- Swift code must compile only in the isolated runner, with no network and bounded CPU, memory, and time.
- Debug requests are size-limited and Zod-validated. AI responses are schema-validated before use.
- Correction edits are scoped to a single reviewed range and reject stale document versions.
- HTTP responses include anti-sniffing, frame-denial, and referrer controls. Add a production reverse proxy with TLS, rate limiting, and CSP before deployment.
- Do not log submitted source code or credentials.
