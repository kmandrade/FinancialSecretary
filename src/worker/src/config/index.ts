import dotenv from "dotenv";

dotenv.config();

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  
  // Intervalos de execucao (cron expressions)
  jobs: {
    // Atualizar precos a cada 5 minutos
    priceUpdate: process.env.PRICE_UPDATE_CRON || "*/5 * * * *",
    
    // Verificar alertas a cada 1 minuto
    alertCheck: process.env.ALERT_CHECK_CRON || "*/1 * * * *",
    
    // Coletar noticias a cada hora
    newsCollection: process.env.NEWS_COLLECTION_CRON || "0 * * * *",
    
    // Enviar resumo diario as 8h
    dailySummary: process.env.DAILY_SUMMARY_CRON || "0 8 * * *",
    
    // Limpar logs antigos todo dia a meia-noite
    logCleanup: process.env.LOG_CLEANUP_CRON || "0 0 * * *",
  },
  
  // Database
  databaseUrl: process.env.DATABASE_URL || "",
  
  // External APIs
  brapiToken: process.env.BRAPI_TOKEN || "",
  newsApiKey: process.env.NEWS_API_KEY || "",
  
  // Push Notifications
  vapidPublicKey: process.env.VAPID_PUBLIC_KEY || "",
  vapidPrivateKey: process.env.VAPID_PRIVATE_KEY || "",
  vapidSubject: process.env.VAPID_SUBJECT || "mailto:contato@investalerta.com.br",
  
  // Email
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: parseInt(process.env.SMTP_PORT || "587", 10),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  
  // Anti-spam
  alertCooldownMinutes: parseInt(process.env.ALERT_COOLDOWN_MINUTES || "30", 10),
} as const;
