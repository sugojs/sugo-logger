export interface ILoggerPlugin {
  handleError?: (error: Error) => void;
  log(message: string, date: Date): void;
  info(message: string, date: Date): void;
  debug(message: string, date: Date): void;
  warn(message: string, date: Date): void;
  error(message: string, date: Date): void;
}
