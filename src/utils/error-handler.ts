import { logger } from './logger'

export enum ErrorCode {
  // File System Errors
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  FILE_ALREADY_EXISTS = 'FILE_ALREADY_EXISTS',
  
  // Network Errors
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  TIMEOUT = 'TIMEOUT',
  API_ERROR = 'API_ERROR',
  
  // Authentication Errors
  AUTH_REQUIRED = 'AUTH_REQUIRED',
  AUTH_FAILED = 'AUTH_FAILED',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  
  // Input Validation
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // CLI Errors
  COMMAND_NOT_FOUND = 'COMMAND_NOT_FOUND',
  INVALID_ARGUMENTS = 'INVALID_ARGUMENTS',
  OPERATION_CANCELLED = 'OPERATION_CANCELLED',
  
  // Plugin Errors
  PLUGIN_NOT_FOUND = 'PLUGIN_NOT_FOUND',
  PLUGIN_LOAD_FAILED = 'PLUGIN_LOAD_FAILED',
  PLUGIN_EXECUTION_FAILED = 'PLUGIN_EXECUTION_FAILED',
  
  // Unknown
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export class DevBuddyError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message)
    this.name = 'DevBuddyError'
  }
}

export const errorHandler = {
  handle: (error: unknown, operation: string): never => {
    if (error instanceof DevBuddyError) {
      handleDevBuddyError(error, operation)
    } else if (error instanceof Error) {
      handleSystemError(error, operation)
    } else {
      handleUnknownError(error, operation)
    }
    process.exit(1)
  },

  throw: (code: ErrorCode, message: string, details?: unknown): never => {
    throw new DevBuddyError(code, message, details)
  },

  assert: (condition: boolean, code: ErrorCode, message: string, details?: unknown): void => {
    if (!condition) {
      throw new DevBuddyError(code, message, details)
    }
  }
}

function handleDevBuddyError(error: DevBuddyError, operation: string): void {
  logger.error(`Error in ${operation}:`, error.message, { prefix: error.code })
  
  if (error.details) {
    logger.debug('Error details:', { prefix: error.code })
    logger.debug(JSON.stringify(error.details, null, 2))
  }

  // Provide helpful messages based on error code
  switch (error.code) {
    case ErrorCode.FILE_NOT_FOUND:
      logger.info('Please check if the file exists and you have the correct path.')
      break
    case ErrorCode.PERMISSION_DENIED:
      logger.info('Please check your file permissions or run with elevated privileges.')
      break
    case ErrorCode.CONNECTION_FAILED:
      logger.info('Please check your internet connection and try again.')
      break
    case ErrorCode.AUTH_REQUIRED:
      logger.info('Please authenticate first using the appropriate command.')
      break
    case ErrorCode.INVALID_INPUT:
      logger.info('Please check your input and try again.')
      break
    // Add more specific help messages for other error codes
  }
}

function handleSystemError(error: Error, operation: string): void {
  logger.error(`System error in ${operation}:`, error)
  if (error.stack) {
    logger.debug('Stack trace:', { prefix: 'SYSTEM_ERROR' })
    logger.debug(error.stack)
  }
}

function handleUnknownError(error: unknown, operation: string): void {
  logger.error(`Unknown error in ${operation}:`, String(error))
  logger.debug('Error details:', { prefix: 'UNKNOWN_ERROR' })
  logger.debug(JSON.stringify(error, null, 2))
} 