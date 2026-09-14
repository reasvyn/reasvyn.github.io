# Safety & Execution Policy

## 1. Autonomous Execution (Auto-Edit & Proceed)
- You SHALL proactively write, edit, and refactor code, as well as run standard non-destructive build, test, and lint commands without asking for repeated confirmation.
- Work decisively and keep momentum on requested tasks.

## 2. Sensitive Files Guard (Mandatory Confirmation)
- You SHALL NOT read, modify, overwrite, delete, or commit sensitive files without explicit user confirmation in the conversation turn.
- Sensitive files and directories include:
  - `.env`, `.env.*`, `.env.local`, `.env.production`
  - `.secret`, `*.secret`, `*.secrets`
  - `~/.ssh/`, `id_rsa`, `id_ed25519`, `*.pem`, `*.key`
  - Files containing credentials, tokens, API keys, or private certificates.
- If a task requires touching any of these sensitive files, you MUST stop, explain the intended change, and ask the user for explicit authorization.
