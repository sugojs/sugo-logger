export class Trace extends Error {
  static get stackTraceLimit() {
    return Infinity;
  }
}

export const get = (message: string) => {
  const trace = { stack: '' };
  Trace.captureStackTrace(trace);
  return trace.stack.replace(/^Error{1}/g, `${message}`);
};
