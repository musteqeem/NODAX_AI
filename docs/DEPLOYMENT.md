# Deployment Notes

NODAX is a persistent Node 20+ process. Koyeb and other container-style hosts should expose `PORT` and keep the session directory persistent.

## Required operational settings

- `BOT_NAME`
- `PREFIX`
- `OWNER_NUMBERS`
- `PAIRING_PHONE` when pairing is required
- `SESSION_DIR`
- `DATA_FILE`

## Health probes

`/health` returns JSON even while WhatsApp is reconnecting. `/ready` returns 200 only after the socket has a user identity.

## Session rule

The application never calls recursive deletion on the session directory. Logged-out sessions are retained and can be inspected or deliberately replaced by an operator.

## Debug sequence

1. Read startup logs.
2. Check `/health`.
3. Use `.registry`.
4. Use `.errors`.
5. Use `.stats`.
6. Test one command from each category.
7. Inspect `data/nodax.json` for group configuration and command error events.
