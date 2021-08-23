import debug from 'debug';

const main = debug('Server');

export function createDebugger(input: string): (...any) => void {
  return main.extend(input);
}
