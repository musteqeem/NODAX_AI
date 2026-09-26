const fs = require('node:fs');
const path = require('node:path');

class CommandRegistry {
  constructor(root = path.resolve(__dirname, '../commands')) { this.root = root; this.byKey = new Map(); this.commands = []; this.errors = []; }
  load() {
    this.byKey.clear(); this.commands = []; this.errors = [];
    for (const category of fs.readdirSync(this.root, { withFileTypes: true }).filter(x => x.isDirectory()).sort((a,b) => a.name.localeCompare(b.name))) {
      const dir = path.join(this.root, category.name);
      for (const file of fs.readdirSync(dir).filter(x => x.endsWith('.js')).sort()) {
        const filePath = path.join(dir, file);
        try {
          delete require.cache[require.resolve(filePath)];
          const exported = require(filePath);
          for (const raw of (Array.isArray(exported) ? exported : [exported])) this.add({ ...raw, category: raw.category || category.name, source: `${category.name}/${file}` });
        } catch (error) { this.errors.push({ file: filePath, error: error.message }); }
      }
    }
    return this.commands.length;
  }
  add(cmd) {
    if (!cmd?.name || typeof cmd.execute !== 'function') throw new Error('Command needs name and execute()');
    const normalized = { ...cmd, name: String(cmd.name).toLowerCase(), alias: (cmd.alias || []).map(x => String(x).toLowerCase()), category: cmd.category || 'General', usage: cmd.usage || `.${cmd.name}`, desc: cmd.desc || `${cmd.name} command` };
    let name = normalized.name; let suffix = 2;
    while (this.byKey.has(name)) name = `${normalized.name}-${normalized.category.toLowerCase()}-${suffix++}`;
    if (name !== normalized.name) normalized.alias = [];
    normalized.name = name; this.commands.push(normalized); this.byKey.set(name, normalized);
    for (const alias of normalized.alias) if (!this.byKey.has(alias)) this.byKey.set(alias, normalized);
  }
  resolve(name) { return this.byKey.get(String(name || '').toLowerCase()); }
  help(category) { const items = this.commands.filter(c => !category || c.category.toLowerCase() === category.toLowerCase()); return items.map(c => `• ${c.usage} — ${c.desc}`).join('\n'); }
}
module.exports = { CommandRegistry };
