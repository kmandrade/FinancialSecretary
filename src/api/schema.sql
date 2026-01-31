-- Schema do banco de dados InvestAlerta (D1/SQLite)
-- Execute com: npx wrangler d1 execute investalerta-db --file=./schema.sql

-- Tabela de usuarios
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  plan TEXT DEFAULT 'FREE' CHECK(plan IN ('FREE', 'INTERMEDIATE', 'GOLD')),
  notifications_enabled INTEGER DEFAULT 1,
  daily_summary_enabled INTEGER DEFAULT 0,
  daily_summary_time TEXT DEFAULT '08:00',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de ativos
DROP TABLE IF EXISTS assets;
CREATE TABLE IF NOT EXISTS assets (
  id TEXT PRIMARY KEY,
  ticker TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('STOCK', 'FII', 'CRYPTO')),
  last_price REAL DEFAULT 0,
  price_updated_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Tabela de watchlist (relacao usuario-ativo)
DROP TABLE IF EXISTS watchlists;
CREATE TABLE IF NOT EXISTS watchlists (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE,
  UNIQUE(user_id, asset_id)
);

-- Tabela de alertas de preco
DROP TABLE IF EXISTS price_alerts;
CREATE TABLE IF NOT EXISTS price_alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  condition TEXT NOT NULL CHECK(condition IN ('ABOVE', 'BELOW')),
  target_price REAL NOT NULL,
  status TEXT DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE', 'TRIGGERED')),
  last_triggered_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- Tabela de historico de alertas disparados
DROP TABLE IF EXISTS alert_history;
CREATE TABLE IF NOT EXISTS alert_history (
  id TEXT PRIMARY KEY,
  alert_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  asset_id TEXT NOT NULL,
  ticker TEXT NOT NULL,
  condition TEXT NOT NULL,
  target_price REAL NOT NULL,
  triggered_price REAL NOT NULL,
  triggered_at TEXT DEFAULT (datetime('now')),
  notification_sent INTEGER DEFAULT 0,
  notification_channel TEXT CHECK(notification_channel IN ('PUSH', 'EMAIL')),
  FOREIGN KEY (alert_id) REFERENCES price_alerts(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (asset_id) REFERENCES assets(id) ON DELETE CASCADE
);

-- Tabela de inscricoes push
DROP TABLE IF EXISTS push_subscriptions;
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, endpoint)
);

-- Tabela de logs de jobs
DROP TABLE IF EXISTS job_logs;
CREATE TABLE IF NOT EXISTS job_logs (
  id TEXT PRIMARY KEY,
  job_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED')),
  message TEXT,
  metadata TEXT, -- JSON string
  started_at TEXT DEFAULT (datetime('now')),
  completed_at TEXT
);

-- Indices para performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_assets_ticker ON assets(ticker);
CREATE INDEX IF NOT EXISTS idx_watchlists_user ON watchlists(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_user ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_price_alerts_status ON price_alerts(status);
CREATE INDEX IF NOT EXISTS idx_alert_history_user ON alert_history(user_id);
CREATE INDEX IF NOT EXISTS idx_job_logs_status ON job_logs(status);

-- Inserir alguns ativos iniciais
INSERT OR IGNORE INTO assets (id, ticker, name, type) VALUES
  ('asset_btc', 'BTC', 'Bitcoin', 'CRYPTO'),
  ('asset_eth', 'ETH', 'Ethereum', 'CRYPTO'),
  ('asset_sol', 'SOL', 'Solana', 'CRYPTO'),
  ('asset_petr4', 'PETR4', 'Petrobras PN', 'STOCK'),
  ('asset_vale3', 'VALE3', 'Vale ON', 'STOCK'),
  ('asset_itub4', 'ITUB4', 'Itau Unibanco PN', 'STOCK'),
  ('asset_xplg11', 'XPLG11', 'XP Log FII', 'FII'),
  ('asset_hglg11', 'HGLG11', 'CSHG Logistica FII', 'FII');
