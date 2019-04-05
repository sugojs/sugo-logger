export interface ILoggerPlugin {
  handleError?: (error: Error) => void;
  trace(message: string, date: Date): void;
  debug(message: string, date: Date): void;
  info(message: string, date: Date): void;
  warn(message: string, date: Date): void;
  error(message: string, date: Date): void;
  fatal(message: string, date: Date): void;
}
