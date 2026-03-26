# Security Policy

## Supported Versions

The following packages are currently supported with security updates:

| Package              | Version | Supported          |
| -------------------- | ------- | ------------------ |
| @dsai-io/react       | 1.0.x   | :white_check_mark: |
| @dsai-io/tools       | 1.0.x   | :white_check_mark: |
| @dsai-io/figma-tokens| 1.0.x   | :white_check_mark: |
| @dsai-io/storybook   | 1.0.x   | :white_check_mark: |
| @dsai-io/docs        | 0.0.x   | :white_check_mark: |

Only the latest minor/patch release of each package receives security updates. Please ensure you are using the most recent version.

## Reporting a Vulnerability

If you discover a security vulnerability in DSAi, please report it responsibly:

1. **Do not** open a public GitHub issue for security vulnerabilities.
2. Instead, please use [GitHub's private vulnerability reporting](https://github.com/michelve/dsai/security/advisories/new) to submit your report.
3. Include as much detail as possible: affected package, version, steps to reproduce, and potential impact.

### What to expect

- **Acknowledgment:** We will acknowledge receipt of your report within 48 hours.
- **Updates:** We will provide status updates at least every 7 days until the issue is resolved.
- **Resolution:** If the vulnerability is accepted, we will work on a fix and release a patched version as soon as possible. You will be credited in the release notes unless you prefer to remain anonymous.
- **Declined reports:** If the reported issue is not considered a vulnerability, we will provide an explanation.

## Security Practices

This project follows these security practices:

- **No dynamic property access via bracket notation** — `Reflect.get()` is used for safe dynamic reads.
- **Prototype pollution prevention** — `__proto__`, `constructor`, and `prototype` keys are blocked.
- **ReDoS prevention** — No nested quantifiers in regex patterns.
- **Input validation** — Allowlists over blocklists.
- **Dependency auditing** — Dependencies are regularly audited and patched for known vulnerabilities.
