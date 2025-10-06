// src/lib/log.ts
// Advanced global logger for consistent logging across the project
// Features: log levels, timestamps, environment-based filtering, debug mode

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

const LOG_LEVELS: Record<LogLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

/**
 * Determines the current log level for the application.
 *
 * If the `LOG_LEVEL` environment variable is set and matches a valid log level,
 * it returns that value. Otherwise, it defaults to `'info'` in production environments
 * and `'debug'` in development environments.
 *
 * @returns {LogLevel} The resolved log level.
 */
const getLogLevel = (): LogLevel => {
  if (process.env.LOG_LEVEL && LOG_LEVELS[process.env.LOG_LEVEL as LogLevel] !== undefined) {
    return process.env.LOG_LEVEL as LogLevel;
  }
  // Default to 'info' in production, 'debug' in development
  return process.env.NODE_ENV === 'production' ? 'info' : 'debug';
};

/**
 * Determines whether a message at the specified log level should be logged
 * based on the current global log level setting.
 *
 * @param level - The log level to check.
 * @returns `true` if the message should be logged; otherwise, `false`.
 */
const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] <= LOG_LEVELS[getLogLevel()];
};

/**
 * Formats log messages by prepending the log level and a timestamp.
 *
 * @param level - The log level to display (e.g., 'info', 'error').
 * @param args - Additional arguments to include in the log message.
 * @returns An array containing the formatted log level, timestamp, and provided arguments.
 */
const format = (level: LogLevel, ...args: unknown[]) => {
  const timestamp = new Date().toISOString();
  return [`[${level.toUpperCase()}]`, timestamp, ...args];
};

type LogEnv = 'dev' | 'prod' | 'all';

function shouldLogEnv(env: LogEnv): boolean {
  if (env === 'all') return true;
  if (env === 'dev') return process.env.NODE_ENV === 'development';
  if (env === 'prod') return process.env.NODE_ENV === 'production';
  return false;
}

const log = {
  error: (args: unknown[], env: LogEnv = 'dev') => {
    if (shouldLogEnv(env) && shouldLog('error')) {
      console.error(...format('error', ...args));
    }
  },
  warn: (args: unknown[], env: LogEnv = 'dev') => {
    if (shouldLogEnv(env) && shouldLog('warn')) {
      console.warn(...format('warn', ...args));
    }
  },
  info: (args: unknown[], env: LogEnv = 'dev') => {
    if (shouldLogEnv(env) && shouldLog('info')) {
      console.info(...format('info', ...args));
    }
  },
  debug: (args: unknown[], env: LogEnv = 'dev') => {
    if (shouldLogEnv(env) && shouldLog('debug')) {
      console.debug(...format('debug', ...args));
    }
  },
};

export default log;
