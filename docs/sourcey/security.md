# Security practices

- store tokens in a secret manager or environment variable
- use minimal token scopes
- redact `Authorization` headers and sensitive response fields
- validate repository, owner, and user inputs
- respect GitHub rate limits and terms of use
- pin dependencies and review lockfile changes
- treat webhook or API content as untrusted input
