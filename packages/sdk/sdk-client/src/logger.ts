export interface Logger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, ...args: unknown[]): void;
}

export class ConsoleLogger implements Logger {
  debug(message: string, ...args: unknown[]): void {
    console.debug(`[threatmap] ${message}`, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`[threatmap] ${message}`, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    console.warn(`[threatmap] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[threatmap] ${message}`, ...args);
  }
}
