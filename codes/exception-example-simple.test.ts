import { divide } from './exception-example-simple';

describe('divide 関数', () => {
  test('正常系：10 ÷ 2 = 5', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('異常系：0 で割ったら例外を投げる', () => {
    expect(() => divide(10, 0)).toThrow(Error);
    expect(() => divide(10, 0)).toThrow('0 で割ることはできません');
  });
});