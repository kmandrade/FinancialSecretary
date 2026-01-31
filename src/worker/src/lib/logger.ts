// Logger simples para Cloudflare Workers

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  jobName?: string;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private minLevel: LogLevel = 'info';
  private jobName?: string;

  setLevel(level: LogLevel) {
    this.minLevel = level;
  }

  setJobName(name: string) {
    this.jobName = name;
  }

  private shouldLog(level: LogLevel): boolean {
    return LOG_LEVELS[level] >= LOG_LEVELS[this.minLevel];
  }

  private formatLog(entry: LogEntry): string {
    const contextStr = entry.context 
      ? ` | ${JSON.stringify(entry.context)}` 
      : '';
    const jobStr = entry.jobName 
      ? ` [${entry.jobName}]` 
      : '';
    return `${entry.timestamp}${jobStr} [${entry.level.toUpperCase()}]: ${entry.message}${contextStr}`;
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      jobName: this.jobName,
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

  // Criar uma instancia com jobName especifico
  child(jobName: string): Logger {
    const childLogger = new Logger();
    childLogger.minLevel = this.minLevel;
    childLogger.jobName = jobName;
    return childLogger;
  }
}

export const logger = new Logger();
