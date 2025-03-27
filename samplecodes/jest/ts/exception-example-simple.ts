export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('0 で割ることはできません');
  }
  return a / b;
}