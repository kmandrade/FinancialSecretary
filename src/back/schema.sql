-- ============================================================================
-- InvestAlerta - Schema do Banco de Dados (Cloudflare D1/SQLite)
-- ============================================================================
-- Execute com: npm run db:migrate
-- Ou: npx wrangler d1 execute investalerta-db --file=./schema.sql
-- ============================================================================

-- ============================================================================
-- CONTA / USUARIO
-- ============================================================================

-- Tabela principal de usuarios (com soft delete LGPD)
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  hash_senha TEXT NOT NULL,
  nome TEXT NOT NULL,
  perfil TEXT NOT NULL DEFAULT 'USUARIO' CHECK(perfil IN ('USUARIO', 'ADMIN')),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now')),
  excluido_em TEXT DEFAULT NULL -- Soft delete LGPD
);

-- Preferencias do usuario (resumo diario, fuso, canais)
DROP TABLE IF EXISTS preferencias_usuario;
CREATE TABLE preferencias_usuario (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL UNIQUE,
  fuso_horario TEXT DEFAULT 'America/Sao_Paulo',
  resumo_diario_ativo INTEGER DEFAULT 0,
  horario_resumo TEXT DEFAULT '08:00', -- HH:mm
  canal_padrao_noticias TEXT DEFAULT 'PUSH' CHECK(canal_padrao_noticias IN ('PUSH', 'EMAIL', 'AMBOS')),
  alerta_aviso_push_obrigatorio INTEGER DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Aceite de termos (LGPD, delay informativo)
DROP TABLE IF EXISTS aceites_termos;
CREATE TABLE aceites_termos (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  versao_termos TEXT NOT NULL,
  aceito INTEGER NOT NULL DEFAULT 0,
  aceito_em TEXT,
  ip TEXT,
  user_agent TEXT,
  observacoes TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================================
-- PLANOS E ASSINATURAS
-- ============================================================================

-- Planos disponiveis (FREE, INTERMEDIARIO, GOLD)
DROP TABLE IF EXISTS planos;
CREATE TABLE planos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  max_ativos_acompanhados INTEGER NOT NULL DEFAULT 2,
  max_alertas_por_ativo INTEGER NOT NULL DEFAULT 3,
  ads_habilitado INTEGER NOT NULL DEFAULT 1,
  preco_mensal REAL NOT NULL DEFAULT 0,
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Assinatura do usuario em um plano
DROP TABLE IF EXISTS assinaturas_usuario;
CREATE TABLE assinaturas_usuario (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  plano_id TEXT NOT NULL,
  inicio_em TEXT NOT NULL DEFAULT (datetime('now')),
  fim_em TEXT,
  renovacao_automatica INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'ATIVA' CHECK(status IN ('ATIVA', 'INADIMPLENTE', 'CANCELADA', 'EXPIRADA')),
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (plano_id) REFERENCES planos(id)
);

-- ============================================================================
-- DISPOSITIVOS E PUSH
-- ============================================================================

-- Dispositivos do usuario (navegador, mobile)
DROP TABLE IF EXISTS dispositivos_usuario;
CREATE TABLE dispositivos_usuario (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  apelido_dispositivo TEXT,
  plataforma TEXT, -- web, android, ios
  user_agent TEXT,
  visto_por_ultimo_em TEXT,
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Inscricoes push (WebPush subscription por dispositivo)
DROP TABLE IF EXISTS inscricoes_push;
CREATE TABLE inscricoes_push (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  dispositivo_id TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  valida INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  revogado_em TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (dispositivo_id) REFERENCES dispositivos_usuario(id) ON DELETE CASCADE,
  UNIQUE(dispositivo_id, endpoint)
);

-- Historico de permissao de notificacao (auditoria negado/bloqueado)
DROP TABLE IF EXISTS historico_permissao_notificacao;
CREATE TABLE historico_permissao_notificacao (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  dispositivo_id TEXT,
  estado TEXT NOT NULL CHECK(estado IN ('CONCEDIDA', 'NEGADA', 'BLOQUEADA', 'PADRAO')),
  origem TEXT NOT NULL CHECK(origem IN ('POPUP_NAVEGADOR', 'TELA_CONFIG_APP', 'CONFIG_SISTEMA', 'DESCONHECIDA')),
  ocorrido_em TEXT NOT NULL DEFAULT (datetime('now')),
  detalhes TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (dispositivo_id) REFERENCES dispositivos_usuario(id) ON DELETE SET NULL
);

-- ============================================================================
-- MERCADO / ATIVOS
-- ============================================================================

-- Catalogo de ativos (acoes, FIIs, cripto)
DROP TABLE IF EXISTS ativos;
CREATE TABLE ativos (
  id TEXT PRIMARY KEY,
  ticker TEXT NOT NULL UNIQUE,
  nome_curto TEXT,
  tipo TEXT NOT NULL CHECK(tipo IN ('ACAO', 'FII', 'CRIPTO')),
  bolsa TEXT DEFAULT 'B3',
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Cotacoes (historico de polling de preco)
DROP TABLE IF EXISTS cotacoes;
CREATE TABLE cotacoes (
  id TEXT PRIMARY KEY,
  ativo_id TEXT NOT NULL,
  preco REAL NOT NULL,
  cotado_em TEXT NOT NULL, -- Data/hora da cotacao na fonte
  buscado_em TEXT NOT NULL DEFAULT (datetime('now')), -- Quando buscamos
  fonte TEXT, -- BRAPI, BINANCE, etc
  FOREIGN KEY (ativo_id) REFERENCES ativos(id) ON DELETE CASCADE
);

-- ============================================================================
-- WATCHLIST
-- ============================================================================

-- Itens da watchlist (usuario acompanha ativo)
DROP TABLE IF EXISTS itens_watchlist;
CREATE TABLE itens_watchlist (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  ativo_id TEXT NOT NULL,
  ativo INTEGER NOT NULL DEFAULT 1,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (ativo_id) REFERENCES ativos(id) ON DELETE CASCADE,
  UNIQUE(usuario_id, ativo_id)
);

-- ============================================================================
-- ALERTAS DE PRECO
-- ============================================================================

-- Alertas de preco (regras acima/abaixo com anti-spam)
DROP TABLE IF EXISTS alertas_preco;
CREATE TABLE alertas_preco (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  ativo_id TEXT NOT NULL,
  condicao TEXT NOT NULL CHECK(condicao IN ('ACIMA_OU_IGUAL', 'ABAIXO_OU_IGUAL')),
  preco_alvo REAL NOT NULL,
  ativo INTEGER NOT NULL DEFAULT 1,
  cooldown_minutos INTEGER NOT NULL DEFAULT 30, -- Anti-spam
  ultimo_disparo_em TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  atualizado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (ativo_id) REFERENCES ativos(id) ON DELETE CASCADE
);

-- Eventos de disparo de alerta (historico)
DROP TABLE IF EXISTS eventos_disparo_alerta;
CREATE TABLE eventos_disparo_alerta (
  id TEXT PRIMARY KEY,
  alerta_id TEXT NOT NULL,
  usuario_id TEXT NOT NULL,
  ativo_id TEXT NOT NULL,
  preco_observado REAL NOT NULL,
  disparado_em TEXT NOT NULL DEFAULT (datetime('now')),
  motivo TEXT NOT NULL DEFAULT 'CONDICAO_ATINGIDA' CHECK(motivo IN ('CONDICAO_ATINGIDA', 'TESTE_MANUAL')),
  FOREIGN KEY (alerta_id) REFERENCES alertas_preco(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (ativo_id) REFERENCES ativos(id) ON DELETE CASCADE
);

-- ============================================================================
-- NOTIFICACOES
-- ============================================================================

-- Mensagens de notificacao (rastreio push/email, status, erro)
DROP TABLE IF EXISTS mensagens_notificacao;
CREATE TABLE mensagens_notificacao (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK(tipo IN ('ALERTA_PRECO', 'RESUMO_DIARIO', 'AVISO_SISTEMA')),
  canal TEXT NOT NULL CHECK(canal IN ('PUSH', 'EMAIL')),
  titulo TEXT NOT NULL,
  corpo TEXT,
  deep_link TEXT,
  status TEXT NOT NULL DEFAULT 'PENDENTE' CHECK(status IN ('PENDENTE', 'ENVIADA', 'FALHOU', 'IGNORADA')),
  id_provedor TEXT, -- ID retornado pelo provedor (FCM, SendGrid, etc)
  erro TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  enviado_em TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ============================================================================
-- NOTICIAS / DIGEST
-- ============================================================================

-- Noticias coletadas (RSS, deduplicacao)
DROP TABLE IF EXISTS noticias;
CREATE TABLE noticias (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  fonte TEXT,
  publicado_em TEXT,
  resumo_bruto TEXT,
  trecho TEXT,
  hash_dedupe TEXT NOT NULL, -- Hash para deduplicacao
  buscado_em TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Relacao noticia-ativo (match com relevancia)
DROP TABLE IF EXISTS noticias_ativos;
CREATE TABLE noticias_ativos (
  id TEXT PRIMARY KEY,
  noticia_id TEXT NOT NULL,
  ativo_id TEXT NOT NULL,
  relevancia REAL DEFAULT 1.0,
  FOREIGN KEY (noticia_id) REFERENCES noticias(id) ON DELETE CASCADE,
  FOREIGN KEY (ativo_id) REFERENCES ativos(id) ON DELETE CASCADE,
  UNIQUE(noticia_id, ativo_id)
);

-- Resumo diario por usuario (digest com metadados do modelo)
DROP TABLE IF EXISTS resumos_diarios;
CREATE TABLE resumos_diarios (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  data_resumo TEXT NOT NULL, -- YYYY-MM-DD
  provedor_modelo TEXT, -- openai, anthropic
  nome_modelo TEXT, -- gpt-4, claude-3
  texto_resumo TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  enviado_em TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  UNIQUE(usuario_id, data_resumo)
);

-- Itens do resumo diario (bullets e ordem)
DROP TABLE IF EXISTS itens_resumo_diario;
CREATE TABLE itens_resumo_diario (
  id TEXT PRIMARY KEY,
  resumo_id TEXT NOT NULL,
  noticia_id TEXT NOT NULL,
  ativo_id TEXT,
  bullets TEXT, -- JSON array de bullets
  ordem INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (resumo_id) REFERENCES resumos_diarios(id) ON DELETE CASCADE,
  FOREIGN KEY (noticia_id) REFERENCES noticias(id) ON DELETE CASCADE,
  FOREIGN KEY (ativo_id) REFERENCES ativos(id) ON DELETE SET NULL
);

-- ============================================================================
-- OPERACAO / JOBS
-- ============================================================================

-- Execucao de jobs (auditoria dos jobs agendados)
DROP TABLE IF EXISTS execucoes_job;
CREATE TABLE execucoes_job (
  id TEXT PRIMARY KEY,
  tipo TEXT NOT NULL CHECK(tipo IN ('POLLING_PRECO', 'COLETA_NOTICIAS', 'DEDUPE_NOTICIAS', 'GERAR_RESUMO', 'DISPARO_NOTIFICACOES')),
  iniciado_em TEXT NOT NULL DEFAULT (datetime('now')),
  finalizado_em TEXT,
  status TEXT NOT NULL DEFAULT 'EXECUTANDO' CHECK(status IN ('EXECUTANDO', 'SUCESSO', 'FALHA', 'PARCIAL')),
  detalhes TEXT,
  qtd_processada INTEGER DEFAULT 0,
  qtd_erros INTEGER DEFAULT 0
);

-- Log de erros (erros por job/usuario/ativo)
DROP TABLE IF EXISTS logs_erro;
CREATE TABLE logs_erro (
  id TEXT PRIMARY KEY,
  ocorrido_em TEXT NOT NULL DEFAULT (datetime('now')),
  tipo_job TEXT CHECK(tipo_job IN ('POLLING_PRECO', 'COLETA_NOTICIAS', 'DEDUPE_NOTICIAS', 'GERAR_RESUMO', 'DISPARO_NOTIFICACOES')),
  usuario_id TEXT,
  ativo_id TEXT,
  mensagem TEXT NOT NULL,
  stack TEXT,
  contexto_json TEXT, -- JSON com dados adicionais
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (ativo_id) REFERENCES ativos(id) ON DELETE SET NULL
);

-- ============================================================================
-- UX / CONTROLE
-- ============================================================================

-- Onboarding do usuario (progresso do primeiro acesso)
DROP TABLE IF EXISTS onboarding_usuario;
CREATE TABLE onboarding_usuario (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL UNIQUE,
  concluido INTEGER NOT NULL DEFAULT 0,
  passo_atual INTEGER NOT NULL DEFAULT 1,
  passo_escolheu_ativos INTEGER NOT NULL DEFAULT 0,
  passo_criou_alerta INTEGER NOT NULL DEFAULT 0,
  passo_habilitou_push INTEGER NOT NULL DEFAULT 0,
  iniciado_em TEXT NOT NULL DEFAULT (datetime('now')),
  concluido_em TEXT,
  dispensado_em TEXT,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- Feature flags (chaves para desligar partes do sistema)
DROP TABLE IF EXISTS feature_flags;
CREATE TABLE feature_flags (
  id TEXT PRIMARY KEY,
  chave TEXT NOT NULL UNIQUE,
  habilitada INTEGER NOT NULL DEFAULT 1,
  escopo TEXT NOT NULL DEFAULT 'GLOBAL' CHECK(escopo IN ('GLOBAL', 'USUARIO')),
  descricao TEXT,
  motivo TEXT,
  alterado_por_usuario_id TEXT,
  alterado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (alterado_por_usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

-- ============================================================================
-- INDICES PARA PERFORMANCE
-- ============================================================================

-- Usuarios
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_perfil ON usuarios(perfil);
CREATE INDEX IF NOT EXISTS idx_usuarios_excluido_em ON usuarios(excluido_em);

-- Assinaturas
CREATE INDEX IF NOT EXISTS idx_assinaturas_usuario ON assinaturas_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_assinaturas_status ON assinaturas_usuario(status);

-- Dispositivos e Push
CREATE INDEX IF NOT EXISTS idx_dispositivos_usuario ON dispositivos_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_push_usuario ON inscricoes_push(usuario_id);
CREATE INDEX IF NOT EXISTS idx_inscricoes_push_valida ON inscricoes_push(valida);

-- Ativos e Cotacoes
CREATE INDEX IF NOT EXISTS idx_ativos_ticker ON ativos(ticker);
CREATE INDEX IF NOT EXISTS idx_ativos_tipo ON ativos(tipo);
CREATE INDEX IF NOT EXISTS idx_cotacoes_ativo ON cotacoes(ativo_id);
CREATE INDEX IF NOT EXISTS idx_cotacoes_buscado_em ON cotacoes(buscado_em);

-- Watchlist
CREATE INDEX IF NOT EXISTS idx_watchlist_usuario ON itens_watchlist(usuario_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_ativo ON itens_watchlist(ativo_id);

-- Alertas
CREATE INDEX IF NOT EXISTS idx_alertas_usuario ON alertas_preco(usuario_id);
CREATE INDEX IF NOT EXISTS idx_alertas_ativo ON alertas_preco(ativo_id);
CREATE INDEX IF NOT EXISTS idx_alertas_ativo_status ON alertas_preco(ativo);
CREATE INDEX IF NOT EXISTS idx_eventos_disparo_alerta ON eventos_disparo_alerta(alerta_id);
CREATE INDEX IF NOT EXISTS idx_eventos_disparo_usuario ON eventos_disparo_alerta(usuario_id);

-- Notificacoes
CREATE INDEX IF NOT EXISTS idx_notificacoes_usuario ON mensagens_notificacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_status ON mensagens_notificacao(status);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON mensagens_notificacao(tipo);

-- Noticias
CREATE INDEX IF NOT EXISTS idx_noticias_hash ON noticias(hash_dedupe);
CREATE INDEX IF NOT EXISTS idx_noticias_publicado ON noticias(publicado_em);
CREATE INDEX IF NOT EXISTS idx_noticias_ativos_noticia ON noticias_ativos(noticia_id);
CREATE INDEX IF NOT EXISTS idx_noticias_ativos_ativo ON noticias_ativos(ativo_id);

-- Resumos
CREATE INDEX IF NOT EXISTS idx_resumos_usuario ON resumos_diarios(usuario_id);
CREATE INDEX IF NOT EXISTS idx_resumos_data ON resumos_diarios(data_resumo);

-- Jobs e Logs
CREATE INDEX IF NOT EXISTS idx_execucoes_job_tipo ON execucoes_job(tipo);
CREATE INDEX IF NOT EXISTS idx_execucoes_job_status ON execucoes_job(status);
CREATE INDEX IF NOT EXISTS idx_logs_erro_tipo ON logs_erro(tipo_job);
CREATE INDEX IF NOT EXISTS idx_logs_erro_usuario ON logs_erro(usuario_id);

-- Feature Flags
CREATE INDEX IF NOT EXISTS idx_feature_flags_chave ON feature_flags(chave);

-- ============================================================================
-- DADOS INICIAIS
-- ============================================================================

-- Planos padrao
INSERT OR IGNORE INTO planos (id, nome, max_ativos_acompanhados, max_alertas_por_ativo, ads_habilitado, preco_mensal, ativo) VALUES
  ('plano_free', 'FREE', 2, 2, 1, 0, 1),
  ('plano_intermediario', 'INTERMEDIARIO', 6, 5, 0, 9.90, 1),
  ('plano_gold', 'GOLD', 20, 10, 0, 19.90, 1);

-- Ativos iniciais (acoes, FIIs, cripto)
INSERT OR IGNORE INTO ativos (id, ticker, nome_curto, tipo, bolsa) VALUES
  -- Criptomoedas
  ('ativo_btc', 'BTC', 'Bitcoin', 'CRIPTO', 'GLOBAL'),
  ('ativo_eth', 'ETH', 'Ethereum', 'CRIPTO', 'GLOBAL'),
  ('ativo_sol', 'SOL', 'Solana', 'CRIPTO', 'GLOBAL'),
  -- Acoes
  ('ativo_petr4', 'PETR4', 'Petrobras PN', 'ACAO', 'B3'),
  ('ativo_vale3', 'VALE3', 'Vale ON', 'ACAO', 'B3'),
  ('ativo_itub4', 'ITUB4', 'Itau Unibanco PN', 'ACAO', 'B3'),
  ('ativo_bbdc4', 'BBDC4', 'Bradesco PN', 'ACAO', 'B3'),
  ('ativo_abev3', 'ABEV3', 'Ambev ON', 'ACAO', 'B3'),
  ('ativo_wege3', 'WEGE3', 'WEG ON', 'ACAO', 'B3'),
  ('ativo_mglu3', 'MGLU3', 'Magazine Luiza ON', 'ACAO', 'B3'),
  ('ativo_bbas3', 'BBAS3', 'Banco do Brasil ON', 'ACAO', 'B3'),
  -- FIIs
  ('ativo_xplg11', 'XPLG11', 'XP Log FII', 'FII', 'B3'),
  ('ativo_hglg11', 'HGLG11', 'CSHG Logistica FII', 'FII', 'B3'),
  ('ativo_mxrf11', 'MXRF11', 'Maxi Renda FII', 'FII', 'B3'),
  ('ativo_knri11', 'KNRI11', 'Kinea Renda Imob FII', 'FII', 'B3'),
  ('ativo_hgbs11', 'HGBS11', 'Hedge Brasil Shopping FII', 'FII', 'B3');

-- Feature flags padrao
INSERT OR IGNORE INTO feature_flags (id, chave, habilitada, escopo, descricao) VALUES
  ('ff_polling_preco', 'JOB_POLLING_PRECO', 1, 'GLOBAL', 'Habilita job de atualizacao de precos'),
  ('ff_coleta_noticias', 'JOB_COLETA_NOTICIAS', 1, 'GLOBAL', 'Habilita job de coleta de noticias'),
  ('ff_gerar_resumo', 'JOB_GERAR_RESUMO', 1, 'GLOBAL', 'Habilita job de geracao de resumo diario'),
  ('ff_disparo_push', 'JOB_DISPARO_PUSH', 1, 'GLOBAL', 'Habilita envio de notificacoes push'),
  ('ff_disparo_email', 'JOB_DISPARO_EMAIL', 1, 'GLOBAL', 'Habilita envio de notificacoes por email'),
  ('ff_adsense', 'ADSENSE_ENABLED', 1, 'GLOBAL', 'Habilita exibicao de AdSense para plano FREE');

-- ============================================================================
-- AUTENTICACAO / RECUPERACAO DE SENHA (MVP)
-- ============================================================================

DROP TABLE IF EXISTS tokens_reset_senha;
CREATE TABLE tokens_reset_senha (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expira_em TEXT NOT NULL,
  utilizado_em TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tokens_reset_usuario ON tokens_reset_senha(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tokens_reset_hash ON tokens_reset_senha(token_hash);
CREATE INDEX IF NOT EXISTS idx_tokens_reset_expira ON tokens_reset_senha(expira_em);

-- ============================================================================
-- VERIFICACAO DE EMAIL (opcional)
-- ============================================================================

DROP TABLE IF EXISTS tokens_verificacao_email;
CREATE TABLE tokens_verificacao_email (
  id TEXT PRIMARY KEY,
  usuario_id TEXT NOT NULL,
  token_hash TEXT NOT NULL UNIQUE,
  expira_em TEXT NOT NULL,
  verificado_em TEXT,
  criado_em TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tokens_verifica_usuario ON tokens_verificacao_email(usuario_id);
CREATE INDEX IF NOT EXISTS idx_tokens_verifica_expira ON tokens_verificacao_email(expira_em);
