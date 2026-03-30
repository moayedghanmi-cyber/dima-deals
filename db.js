// db.js – SQLite database setup using better-sqlite3
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, 'dimadeals.db'));

// Enable WAL mode for better performance
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── SCHEMA ───────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    username  TEXT    NOT NULL UNIQUE,
    password  TEXT    NOT NULL,  -- bcrypt hash
    created_at TEXT   DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    category   TEXT    NOT NULL,
    icon       TEXT    DEFAULT '📦',
    bg_color   TEXT    DEFAULT '#141414',
    description TEXT   DEFAULT '',
    price      REAL    NOT NULL,
    badge      TEXT    DEFAULT '',
    active     INTEGER DEFAULT 1,
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id           TEXT    PRIMARY KEY,  -- e.g. DD-A1B2C3
    customer_name  TEXT  NOT NULL,
    customer_email TEXT  NOT NULL,
    customer_whatsapp TEXT DEFAULT '',
    delivery_method TEXT DEFAULT 'email',
    payment_method  TEXT NOT NULL,
    items_json     TEXT  NOT NULL,  -- JSON array
    total          REAL  NOT NULL,
    status         TEXT  DEFAULT 'pending',  -- pending | approved | rejected
    receipt_file   TEXT  DEFAULT '',
    notes          TEXT  DEFAULT '',
    created_at     TEXT  DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL,
    message    TEXT    NOT NULL,
    read       INTEGER DEFAULT 0,
    created_at TEXT    DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT
  );
`);

// ─── SEED DEFAULT ADMIN (if none exists) ──────────────────────────────────────
const adminCount = db.prepare('SELECT COUNT(*) as c FROM admins').get();
if (adminCount.c === 0) {
  const hash = bcrypt.hashSync('admin2026', 10);
  db.prepare('INSERT INTO admins (username, password) VALUES (?, ?)').run('admin', hash);
  console.log('✅ Default admin created → username: admin | password: admin2026');
}

// ─── SEED DEFAULT PRODUCTS (if none) ─────────────────────────────────────────
const prodCount = db.prepare('SELECT COUNT(*) as c FROM products').get();
if (prodCount.c === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, category, icon, bg_color, description, price, badge)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  const defaults = [
    ['Netflix Premium',    'streaming', '🎬', '#141414', '4K UHD · 1 screen · 1 month',          25,  'Best Seller'],
    ['Spotify Premium',    'music',     '🎵', '#1db954', 'Ad-free music · Offline mode · 1 month', 15, ''],
    ['Canva Pro',          'design',    '🎨', '#7d2ae8', 'All premium templates · 1 month',        20,  'Popular'],
    ['YouTube Premium',    'streaming', '▶️', '#ff0000', 'No ads · Background play · 1 month',     18, ''],
    ['Disney+',            'streaming', '✨', '#0e2d6b', 'Full library · HD · 1 month',             22, ''],
    ['Apple Music',        'music',     '🍎', '#fc3c44', '90M songs · Spatial audio · 1 month',    16, ''],
    ['Adobe Express',      'design',    '🅰️', '#ff0000', 'Premium templates · AI tools · 1 month', 22, 'New'],
    ['TikTok Premium',     'social',    '🎵', '#010101', 'No ads · TikTok LIVE · 1 month',         12, ''],
  ];
  defaults.forEach(row => insert.run(...row));
  console.log('✅ Default products seeded');
}

// ─── SEED DEFAULT SETTINGS ────────────────────────────────────────────────────
const settingsDefaults = {
  flouci_number:   '+216 22 333 444',
  d17_number:      '+216 22 333 444',
  poste_rib:       '17 000 0000000 00',
  virement_rib:    'XX XXX XXXXXXXXXXXXXXXX XX',
  wafacash_number: '+216 22 333 444',
  whatsapp_support:'+216 XX XXX XXX',
  email_support:   'support@dimadeals.tn',
  store_name:      'DimaDeals',
};
const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
Object.entries(settingsDefaults).forEach(([k, v]) => insertSetting.run(k, v));

module.exports = db;
