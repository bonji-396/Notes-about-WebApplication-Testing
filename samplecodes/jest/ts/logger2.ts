export function log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
  console.log(`[${level.toUpperCase()}] ${message}`);
}