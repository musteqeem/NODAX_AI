# Northflank

Create a deployment/combined service from the repository.

- Build: Dockerfile or Node buildpack.
- Dockerfile: `/Dockerfile`.
- Public HTTP port: `3000`.
- Health endpoint: `/health`.
- Command: `npm start`.
- Add `.env` values as Northflank environment variables.
- Configure persistent storage for `SESSION_DIR` and `DATA_FILE` when the deployment needs durable state.

Northflank supports Dockerfile/buildpack deployment, public ports, health checks and persistent volumes.
