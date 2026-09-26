# Google Cloud Run

1. Build the existing root `Dockerfile`.
2. Push the image to Artifact Registry.
3. Deploy it to Cloud Run on port 3000.
4. Set `PAIRING_PHONE`, `OWNER_NUMBERS`, `BOT_NAME`, `PREFIX` and other secrets as runtime environment variables.
5. Keep exactly one active instance for a single WhatsApp session.
6. Plan external/persistent state before using the service for a long-lived account.

Example:

```bash
gcloud builds submit --tag REGION-docker.pkg.dev/PROJECT/nodax/nodax:latest
gcloud run deploy nodax --image REGION-docker.pkg.dev/PROJECT/nodax/nodax:latest --port 3000
```

Cloud Run is suitable for the containerized HTTP runtime, but the WhatsApp auth directory must not be treated as disposable state.
