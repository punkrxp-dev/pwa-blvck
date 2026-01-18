// Simple logging utility for production debugging
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
  component?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  private logs: LogEntry[] = [];
  private maxLogs = 100;

  private createLogEntry(level: LogLevel, message: string, data?: any, component?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      component
    };
  }

  private log(entry: LogEntry) {
    // Keep logs in memory for debugging
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Console logging
    const prefix = entry.component ? `[${entry.component}]` : '';
    const message = `${prefix} ${entry.message}`;

    switch (entry.level) {
      case 'debug':
        if (this.isDevelopment) console.debug(message, entry.data);
        break;
      case 'info':
        console.info(message, entry.data);
        break;
      case 'warn':
        console.warn(message, entry.data);
        break;
      case 'error':
        console.error(message, entry.data);
        break;
    }
  }

  debug(message: string, data?: any, component?: string) {
    this.log(this.createLogEntry('debug', message, data, component));
  }

  info(message: string, data?: any, component?: string) {
    this.log(this.createLogEntry('info', message, data, component));
  }

  warn(message: string, data?: any, component?: string) {
    this.log(this.createLogEntry('warn', message, data, component));
  }

  error(message: string, data?: any, component?: string) {
    this.log(this.createLogEntry('error', message, data, component));
  }

  // Get recent logs for debugging
  getRecentLogs(count = 10): LogEntry[] {
    return this.logs.slice(-count);
  }

  // Clear logs
  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
export default logger;