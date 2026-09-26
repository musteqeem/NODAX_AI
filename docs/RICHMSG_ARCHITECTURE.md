# RichMsg Architecture

NODAX keeps rich rendering separate from command business logic. `richHtml.js` owns escaping, HTML layout, cards, tables, progress bars, menus and the WhatsApp rich-response primitive. Commands only select data and call the renderer.

## Render layers

1. Command validates arguments and permissions.
2. Business function obtains data or changes state.
3. Rich renderer escapes user-controlled text.
4. `sendHtmlPrimitive()` builds the unified rich response payload.
5. Baileys relays the message.
6. The central handler catches failures and sends a fallback text response.

## Why the fallback exists

Experimental WhatsApp rich rendering can vary by client/server version. A rich command therefore always has a text fallback instead of failing silently.

## Game state

Game sessions are keyed by chat, sender and game name. The game engine keeps score and round state in memory. This prevents one player's answer from changing another player's active session. Restarting the process resets active game sessions.

## Security

HTML escaping is mandatory for text inserted into the rich document. The renderer does not execute user-supplied markup.
