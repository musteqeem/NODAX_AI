const crypto = require('node:crypto');
function inputText(args = [], m = {}) { return args.join(' ').trim() || String(m.quoted?.text || '').trim(); }
function normalizeJid(jid) { return String(jid || '').replace(/:\d+(?=@)/, ''); }
function unique(items) { return [...new Set((items || []).filter(Boolean))]; }
function getTargets(m, args = []) { const targets = []; if (m.quoted?.sender) targets.push(m.quoted.sender); for (const jid of m.mentionedJid || []) targets.push(jid); for (const arg of args) { const digits = String(arg).replace(/\D/g, ''); if (digits.length >= 7) targets.push(`${digits}@s.whatsapp.net`); } return unique(targets.map(normalizeJid)); }
function formatJid(jid) { return `@${normalizeJid(jid).split('@')[0]}`; }
function commandInfo({ name, alias = [], category, desc, usage, execute, ...flags }) { return { name, alias, category, desc: desc || `${name} command`, usage: usage || `.${name}`, ...flags, execute }; }
function safeJson(value, max = 12000) { const out = typeof value === 'string' ? value : JSON.stringify(value, null, 2); return out.length > max ? `${out.slice(0, max - 18)}\n…truncated` : out; }
function hash(text, algorithm = 'sha256') { return crypto.createHash(algorithm).update(String(text)).digest('hex'); }
module.exports = { inputText, normalizeJid, unique, getTargets, formatJid, commandInfo, safeJson, hash };
