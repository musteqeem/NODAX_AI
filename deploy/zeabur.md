# Zeabur

The repository root `Dockerfile` is ready for Zeabur's Dockerfile deployment flow.

- Service: NODAX AI
- Port: `3000`
- Start: provided by the Dockerfile
- Health: `/health`
- Configure environment variables in the service.
- Use persistent storage if the service must retain the WhatsApp session/data.

Zeabur automatically detects a root Dockerfile for Docker deployments.
