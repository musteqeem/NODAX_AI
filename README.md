# NODAX WhatsApp Command Bot

NODAX is a deterministic WhatsApp command bot created by Musteqeem. It is intentionally **not an LLM chatbot**: commands are explicit, inspectable JavaScript handlers with predictable permission checks. It uses `@musteqeem/baileys`, pairing-code login, persistent JSON state, rich WhatsApp messages, an XADON-compatible command contract, and a hot-reloadable registry.

## Current build

- **245 loaded commands** across Utility, Group, Media, Games, Owner, and Defense.
- **Exactly 30 defense commands** with persistent group settings.
- No QR login path. Fresh sessions use `PAIRING_PHONE` and `sock.requestPairingCode()`.
- Every command exports the XADON-style shape:

```js
module.exports = {
  name: 'ping',
  alias: ['p'],
  category: 'Utility',
  desc: 'Check NODAX latency and process health',
  usage: '.ping',
  groupOnly: false,
  adminOnly: false,
  ownerOnly: false,
  botAdmin: false,
  execute: async (sock, message, { args, reply, store, registry }) => reply('PONG')
};
```

You can export an array of command objects from one file, exactly like the supplied XADON loader supports. Add a file under `src/commands/<Category>/`, restart NODAX or use `.reload`, and the registry discovers it automatically. Duplicate names are made deterministic rather than silently overwriting an existing command.

## First run

```bash
cp .env.example .env
npm install
npm test
npm run doctor
npm start
```

Set `PAIRING_PHONE` in `.env` to the full international phone number without `+`, spaces, or dashes. On a fresh session NODAX prints a pairing code. In WhatsApp use **Linked devices → Link a device → Link with phone number instead**, then enter the code. `printQRInTerminal` is disabled and there is no QR fallback.

Keep `sessions/` and `data/` private and persistent. Never run two NODAX processes against the same session directory.

## Command groups

The command pack includes practical utilities, keyless public information commands, arithmetic and text tools, rich formatting, group metadata and membership management, admin-only settings, stickers and reactions, polls, games, quizzes, operator diagnostics, and moderation controls. Examples include `.weather Lagos`, `.wiki Ada Lovelace`, `.define resilient`, `.calc (12*12)`, `.sticker`, `.ginfo`, `.tagall`, `.promote @user`, `.quiz`, `.antilink on`, and `.help Defense`.

The public information commands use ordinary HTTP APIs rather than AI: Open-Meteo weather, Wikimedia summaries, Dictionary API definitions, JokeAPI, REST Countries, and GitHub repository data. Public endpoints can rate-limit or become unavailable; NODAX reports the error instead of fabricating an answer.

## 30 defense commands

`antilink`, `antiinvite`, `antispam`, `antiflood`, `anticaps`, `antiemoji`, `antitag`, `antiword`, `antiscam`, `antiphishing`, `antirepeat`, `antilongtext`, `antiunicode`, `antiforward`, `antimedia`, `antiimage`, `antivideo`, `antiaudio`, `antisticker`, `antidocument`, `anticontact`, `antilocation`, `antipoll`, `antiviewonce`, `antibot`, `antinsfw`, `antistatus`, `anticall`, `antidisappearing`, and `antighost` each support `.name on`, `.name off`, and `.name status`. Automatic enforcement runs before command dispatch, bypasses admins, deletes offending messages when possible, warns users, logs events, and removes at the configured warning threshold when NODAX is a group admin.

Welcome and goodbye events are enabled by default. Group admins can use `.welcome on/off`, `.goodbye on/off`, `.setwelcome <template>`, and `.setgoodbye <template>`. Templates support `@user`, `@group`, and `@count`.

## Deployment

### Termux

```bash
pkg update && pkg install nodejs git
cd nodax-ai
cp .env.example .env
npm install
npm start
```

Keep Termux awake with a foreground session. A VPS is better for unattended 24/7 operation.

### Render

The included `render.yaml` uses `npm ci`, `npm start`, `/health`, and a persistent disk for `runtime/sessions` and `runtime/nodax.json`. Add `PAIRING_PHONE`, `OWNER_NUMBERS`, and the remaining `.env` values as Render environment variables.

### Pterodactyl

Use a Node 20+ egg, persistent storage, define the environment variables in the panel, and set the startup command to `bash deploy/pterodactyl-start.sh`.

### VPS

Copy the project to `/opt/nodax`, run `npm ci`, create `.env`, and use `deploy/nodax.service.example` as a systemd template. Run `sudo systemctl enable --now nodax` after installing the service.

### Railway

Create a Railway service from the repository. The included `railway.json` uses `npm ci`, `npm start`, `/health`, and automatic restart on failure. Add `PAIRING_PHONE`, `OWNER_NUMBERS`, and the remaining environment variables in Railway Variables. Attach persistent storage if the plan supports it; otherwise export and preserve `sessions/` before replacing the service.

### Fly.io

Install `flyctl`, run `fly launch --no-deploy`, review the generated app name in `fly.toml`, create the persistent volume, set secrets, and deploy:

```bash
fly volumes create nodax_state --region ams --size 1
fly secrets set PAIRING_PHONE=2348012345678 OWNER_NUMBERS=2348000000000
fly deploy
```

The included `fly.toml` keeps one machine running and checks `/health`. Use a region close to the WhatsApp account and keep the volume attached to the only active machine.

### Koyeb

Create a Web Service from the repository and use the included `koyeb.yaml`, or set build command `npm ci` and run command `npm start`. Add environment variables in Koyeb. Koyeb’s filesystem may be ephemeral depending on the plan, so use an attached persistent volume or preserve the `sessions/` directory before redeploying.

### Heroku-compatible hosting

The repository includes `Procfile` and `app.json`. Deploy with the Heroku CLI or any compatible provider:

```bash
heroku create nodax-ai-whatsapp
heroku config:set PAIRING_PHONE=2348012345678 OWNER_NUMBERS=2348000000000
git push heroku main
```

Important: standard Heroku dyno filesystems are ephemeral. This target is suitable for testing only unless WhatsApp authentication state is moved to persistent external storage. Never assume a dyno restart will preserve `sessions/`.

### Docker and Docker Compose

Docker is included as an additional portable deployment target. Build and run with a persistent volume:

```bash
cp .env.example .env
# edit .env and set PAIRING_PHONE
docker compose up -d --build
docker compose logs -f nodax
```

The included `Dockerfile` and `docker-compose.yml` expose `/health` on port 3000 and persist `/app/runtime`, which contains the WhatsApp session and NODAX data.

## Testing

`npm test` validates the command count, exactly 30 defense commands, metadata contract, duplicate handling, and module loading. `npm run doctor` checks runtime version, package configuration, command count, defense count, and loader errors. Syntax validation is performed by Node’s parser across all source files.

## Scope honesty

NODAX is a command bot, not a human or autonomous agent. It will only perform actions represented by an installed command handler and permitted by WhatsApp/admin checks. Some operations depend on WhatsApp assigning NODAX admin status or on a public API being reachable. This makes the behavior inspectable, testable, and easy to extend.
