# ֎ NODAX AI v3 — Professional WhatsApp Command Engine

**Created & engineered by Musteqeem — Future Scientist**

NODAX v3 is a real command engine, not a command-count demo. Each exported command has an `execute()` function, permission metadata, usage text, and a debuggable source path.

## What changed

- Dedicated command handlers instead of one giant fallback switch.
- Registry detects duplicate names **and duplicate aliases**.
- Message handler normalizes quoted messages, mentions, buttons/list replies and captions.
- Defense runs before command dispatch and logs rule failures.
- Session folders are never auto-deleted.
- Rich HTML utilities are centralized in `src/core/richHtml.js`.
- 30+ game commands use a stateful game engine and RichMsg HTML rendering.
- 60 Rich category commands provide reusable RichMsg views.
- Live Web commands use timeout, cache and retry behavior.
- Science commands have dedicated implementations.
- Group commands validate group/admin/bot-admin requirements.
- 30 country locale profiles are included.
- `mumaker` integration is optional at runtime and exposes TextPro/Ephoto/Photooxy commands.
- Newsletter context, AI badge metadata and secure labels remain configurable.
- Health endpoints are deployment friendly.

## Command packs

```text
src/
├── commands/
│   ├── Defense/
│   ├── Education/
│   ├── Games/
│   ├── Group/
│   ├── Media/
│   ├── Owner/
│   ├── Rich/
│   ├── Science/
│   ├── Utility/
│   └── Web/
├── core/
│   ├── commandRegistry.js
│   ├── defenseEngine.js
│   ├── gameEngine.js
│   ├── helpers.js
│   ├── i18n.js
│   ├── publicApis.js
│   └── richHtml.js
└── store/
    └── jsonStore.js
```

## RichMsg

The Rich pack provides reusable HTML builders for:

- menu
- help
- status
- statistics
- profile
- tables
- progress
- cards
- quotes
- weather
- country
- GitHub
- NPM
- science
- quiz
- games
- groups
- defense
- APIs
- languages
- server
- uptime
- memory
- commands
- categories
- owner
- welcome
- rules
- warnings
- scores
- leaderboard
- facts
- formulas
- periodic table
- conversion
- calculator
- text
- code
- JSON
- lists
- tags
- links
- contact
- badges
- headers/footers
- alerts
- success/error/loading views
- search/news/book/dictionary/translation/currency/crypto/package views

The HTML primitive is sent through `generateWAMessageFromContent()` and the installed `@musteqeem/baileys` rich response path. Availability of experimental WhatsApp rendering can vary with the client/server version.

## Games

Games are intentionally non-gambling. The pack includes:

`quiz`, `sciencequiz`, `math`, `word`, `typing`, `reaction`, `number`, `rps`, `hangman`, `memory`, `trivia`, `capital`, `elementgame`, `anagram`, `oddone`, `sequence`, `truefalse`, `equationgame`, `fractiongame`, `percentgame`, `speedmath`, `vocab`, `spelling`, `synonym`, `antonym`, `pattern`, `logic`, `riddle`, `geography`, `biology`.

Every game goes through `src/core/gameEngine.js` and renders a RichMsg state card.

## 30 locale profiles

NG, US, GB, CA, AU, GH, KE, ZA, FR, DE, ES, IT, PT, BR, MX, AR, IN, PK, BD, ID, MY, TR, SA, AE, EG, JP, KR, CN, RU and more can be extended through `src/core/i18n.js`.

Examples:

```text
.lang NG
.lang FR
.lang JP
.translate fr hello world
```

Translation uses a public service by default. For production, set `TRANSLATE_URL` to your preferred translation provider.

## Web APIs

Implemented live integrations include:

- Open-Meteo + geocoding
- Wikimedia
- Dictionary API
- JokeAPI
- REST Countries
- GitHub REST
- DummyJSON quotes
- Advice Slip
- ipapi
- CoinGecko
- npm registry
- ExchangeRate-API
- MyMemory translation

The API layer uses a timeout, a small retry policy and short caching. API failure is surfaced to the user rather than replaced with fabricated data.

## Mumaker

Install:

```bash
npm install
```

Commands:

```text
.textpro MUSTEQEEM
.ephoto NODAX AI
.photooxy FUTURE SCIENTIST
.makerhelp
```

`mumaker` documents TextPro, Ephoto and Photooxy generation methods. Its upstream package is older, so the integration is deliberately isolated in the Media command pack and reports failures cleanly rather than breaking the whole bot.

## Newsletter / AI badge

```env
NEWSLETTER_JID=120363xxxxxxxxxxxx@newsletter
NEWSLETTER_NAME=MUSTEQEEM VERIFIED ✓
AI_BADGE=true
SECURE_META_LABEL=true
```

`@musteqeem/baileys` documents newsletter sending, interactive messages, albums, persistent sessions and extended message support. Use only features supported by the installed package version.

## Deployment

Works as a normal Node 20+ process. Existing deployment descriptors for Koyeb and other hosts are retained.

Required:

```env
BOT_NAME=NODAX AI
PREFIX=.
OWNER_NUMBERS=234xxxxxxxxxx
PAIRING_PHONE=234xxxxxxxxxx
SESSION_DIR=sessions
DATA_FILE=data/nodax.json
PORT=3000
WARN_LIMIT=3
MAX_MESSAGES_PER_10S=8
```

Health:

```text
GET /
GET /health
GET /ready
```

## Debugging

```text
.reload
.registry
.errors
.stats
```

Every command error is logged with command name, chat, sender and error message.

## Safety and responsible use

This project is intended for legitimate automation, support, education, moderation and developer tooling. Do not use it for spam, fraud, stalking or other abusive automation. WhatsApp/Meta affiliation is not implied.

## Credits

**MUSTEQEEM — FUTURE SCIENTIST**

`֎ NODAX AI`

Built with `@musteqeem/baileys`.
