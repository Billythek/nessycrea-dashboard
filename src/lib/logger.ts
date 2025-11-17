/**
 * Syst?me de logging centralis? pour l'application
 * 
 * En production, les logs de debug sont d?sactiv?s automatiquement
 * pour am?liorer les performances et r?duire le bruit dans la console.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
}

class Logger {
  private isDevelopment: boolean
  private logHistory: LogEntry[] = []
  private maxHistorySize = 100

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    }

    // Garder un historique limit? des logs
    this.logHistory.push(entry)
    if (this.logHistory.length > this.maxHistorySize) {
      this.logHistory.shift()
    }

    // En production, ne logger que les warnings et erreurs
    if (!this.isDevelopment && (level === 'debug' || level === 'info')) {
      return
    }

    // Logger dans la console avec le bon niveau
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'
    const prefix = `[${level.toUpperCase()}]`

    if (data) {
      console[consoleMethod](prefix, message, data)
    } else {
      console[consoleMethod](prefix, message)
    }
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data)
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data)
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data)
  }

  error(message: string, error?: unknown): void {
    if (error instanceof Error) {
      this.log('error', message, {
        message: error.message,
        stack: error.stack,
        name: error.name,
      })
    } else {
      this.log('error', message, error)
    }
  }

  /**
   * Log une erreur Supabase avec des d?tails pertinents
   */
  supabaseError(context: string, error: unknown): void {
    if (error && typeof error === 'object' && 'message' in error) {
      this.error(`Supabase error in ${context}`, {
        message: (error as { message: string }).message,
        details: error,
      })
    } else {
      this.error(`Supabase error in ${context}`, error)
    }
  }

  /**
   * R?cup?re l'historique des logs (utile pour le d?bogage)
   */
  getHistory(): LogEntry[] {
    return [...this.logHistory]
  }

  /**
   * Nettoie l'historique des logs
   */
  clearHistory(): void {
    this.logHistory = []
  }
}

// Export d'une instance singleton
export const logger = new Logger()

// Export des fonctions pour faciliter l'utilisation
export const log = {
  debug: (message: string, data?: unknown) => logger.debug(message, data),
  info: (message: string, data?: unknown) => logger.info(message, data),
  warn: (message: string, data?: unknown) => logger.warn(message, data),
  error: (message: string, error?: unknown) => logger.error(message, error),
  supabaseError: (context: string, error: unknown) => logger.supabaseError(context, error),
}
