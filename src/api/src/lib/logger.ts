// Logger simples para Cloudflare Workers
// Cloudflare Workers nao suportam Winston, entao usamos um logger customizado

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  requestId?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private minLevel: LogLevel = 'info';
  private requestId?: string;

  setLevel(level: LogLevel) {
    this.minLevel = level;
  }

  setRequestId(id: string) {
    this.requestId = id;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private formatLog(entry: LogEntry): string {
    const contextStr = entry.context 
      ? ` | ${JSON.stringify(entry.context)}` 
      : '';
    const requestStr = entry.requestId 
      ? ` [${entry.requestId}]` 
      : '';
    return `${entry.timestamp}${requestStr} [${entry.level.toUpperCase()}]: ${entry.message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      requestId: this.requestId,
    };

    const formatted = this.formatLog(entry);

    switch (level) {
      case 'debug':
        console.debug(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'error':
        console.error(formatted);
        break;
    }
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, unknown>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, unknown>) {
    this.log('error', message, context);
  }

  // Criar uma instancia com requestId especifico
  child(requestId: string): Logger {
    const childLogger = new Logger();
    childLogger.minLevel = this.minLevel;
    childLogger.requestId = requestId;
    return childLogger;
  }
}

export const logger = new Logger();

// Helper para criar ID de request unico
export function generateRequestId(): string {
  return `req_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
}
