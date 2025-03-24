export const add = (a: number, b: number): number => a + b;
export const multiply = (a: number, b: number): number => a * b;
export const divide = (a: number, b: number): number => {
  if (b === 0) {
    throw new Error('0で割ることはできません');
  }
  return a / b;
}