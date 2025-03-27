export const multiply = (a: number, b: number): number => a * b;

export const math = {
  add(a: number, b: number): number {
    return a + b;
  },
  
  subtract(a: number, b: number): number {
    return a - b;
  },
  
  multiply(a: number, b: number): number {
    return a * b;
  },
  
  divide(a: number, b: number): number {
    if (b === 0) throw new Error('0で割ることはできません');
    return a / b;
  },
  
  calculateArea(radius: number): number {
    return this.multiply(this.multiply(radius, radius), Math.PI);
  }
};