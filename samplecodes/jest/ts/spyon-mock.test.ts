import { Calculator } from './spyon-mock';

test('sumメソッドをSpyOnする', () => {
  const calc = new Calculator();
  // spyの設定
  const sumSpy = jest.spyOn(calc, 'sum');
  const result = calc.sum(1, 2);
  expect(result).toBe(3);
  expect(sumSpy).toHaveBeenCalledWith(1, 2);
  expect(sumSpy).toHaveBeenCalledTimes(1);

  expect(calc.sum(1, 2)).toBe(33);

  // spyの解除
  sumSpy.mockRestore();
});
