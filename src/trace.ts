export class Trace extends Error {
  public stack = '';
  static get stackTraceLimit() {
    return Infinity;
  }
}

export const get = (message: string): string => {
  const trace = new Trace();
  Trace.captureStackTrace(trace);
  return trace.stack.replace(/^Error{1}/g, message);
};
