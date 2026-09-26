const fs = require('node:fs');
const path = require('node:path');

class JsonStore {
  constructor(file = path.resolve(process.env.DATA_FILE || 'data/nodax.json')) {
    this.file = file;
    this.data = { groups: {}, warnings: {}, logs: [], kv: {} };
    this.load();
  }
  load() {
    fs.mkdirSync(path.dirname(this.file), { recursive: true });
    try { if (fs.existsSync(this.file)) this.data = { ...this.data, ...JSON.parse(fs.readFileSync(this.file, 'utf8')) }; } catch (e) { console.error('[store] load:', e.message); }
  }
  save() { fs.mkdirSync(path.dirname(this.file), { recursive: true }); const tmp = `${this.file}.tmp`; fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2)); fs.renameSync(tmp, this.file); }
  group(jid) {
    this.data.groups[jid] ||= { welcome: process.env.WELCOME_ENABLED !== 'false', goodbye: process.env.GOODBYE_ENABLED !== 'false', welcomeText: 'Welcome @user to @group! You are member @count.', goodbyeText: 'Goodbye @user. We wish you well.', antilink: false, antispam: false, antitag: false, antiflood: false, antilinkAction: 'delete', whitelist: [], words: [], locked: false };
    return this.data.groups[jid];
  }
  warn(group, user, reason) { const key = `${group}:${user}`; this.data.warnings[key] ||= { count: 0, reasons: [] }; this.data.warnings[key].count++; this.data.warnings[key].reasons.push({ reason, at: Date.now() }); this.save(); return this.data.warnings[key].count; }
  getWarnings(group, user) { return this.data.warnings[`${group}:${user}`]?.count || 0; }
  clearWarnings(group, user) { delete this.data.warnings[`${group}:${user}`]; this.save(); }
  log(event) { this.data.logs.push({ ...event, at: Date.now() }); this.data.logs = this.data.logs.slice(-1000); this.save(); }
}
module.exports = { JsonStore };
