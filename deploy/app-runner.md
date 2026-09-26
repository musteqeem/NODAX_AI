# AWS App Runner

Use the repository Dockerfile as the container source.

Recommended settings:
- Port: `3000`
- Start command: Dockerfile default (`npm start`)
- Health endpoint: `/health`
- Configure `BOT_NAME`, `PAIRING_PHONE`, `OWNER_NUMBERS`, `PREFIX` and other values as environment variables/secrets.
- Keep one active service instance for a single WhatsApp authentication state.
- Do not assume the local filesystem is durable across deployments; externalize state if your App Runner setup requires durable sessions.

For production WhatsApp use, verify the provider's current storage/network behavior before deployment.
