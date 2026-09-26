# API Matrix

| Command | Provider | Input | Failure handling |
|---|---|---|---|
| weather | Open-Meteo + geocoding | place | API error returned to user |
| wiki | Wikimedia | topic | API error returned to user |
| define | Dictionary API | word | API error returned to user |
| joke | JokeAPI | none | API error returned to user |
| country | REST Countries | country | API error returned to user |
| github | GitHub REST | owner/repo | API error returned to user |
| quoteapi | DummyJSON | none | API error returned to user |
| advice | Advice Slip | none | API error returned to user |
| ipinfo | ipapi | IP or json | API error returned to user |
| crypto | CoinGecko | coin id | API error returned to user |
| npm | npm registry | package | API error returned to user |
| exchange | ExchangeRate-API | from/to/amount | API error returned to user |
| translate | MyMemory or TRANSLATE_URL | target + text | API error returned to user |

The API client applies a short timeout, one retry and short-lived cache. No command invents a successful response when a provider fails.
