// calculator.test.ts
import { add, multiply, divide } from './calculator';

describe('電卓のテスト', () => {
  
  // 基本的なパラメータライズドテスト
  // 配列の各要素 [a, b, expected] で指定したパラメータを使ってテストを実行します
  test.each([
    [1, 1, 2],
    [2, 2, 4],
    [5, 3, 8],
    [0, 0, 0],
    [-1, 1, 0],
  ])('add(%i, %i) => %i', (a, b, expected) => {
    expect(add(a, b)).toBe(expected);
  });

  // オブジェクト配列を使ったパラメータライズドテスト
  // 各テストケースに名前をつけて管理できます
  test.each([
    { a: 2, b: 3, expected: 6, name: '正の数の乗算' },
    { a: 0, b: 5, expected: 0, name: 'ゼロとの乗算' },
    { a: -2, b: 3, expected: -6, name: '負の数を含む乗算' },
    { a: -2, b: -3, expected: 6, name: '負の数同士の乗算' },
  ])('$name: multiply($a, $b) => $expected', ({ a, b, expected }) => {
    expect(multiply(a, b)).toBe(expected);
  });

  // テーブル形式のパラメータライズドテスト
  describe.each`
    a      | b     | expected | scenario
    ${10}  | ${2}  | ${5}     | ${'正の数の除算'}
    ${10}  | ${-2} | ${-5}    | ${'負の数での除算'}
    ${0}   | ${5}  | ${0}     | ${'0を割る'}
  `('除算のテスト: $scenario', ({ a, b, expected }) => {
    test(`divide(${a}, ${b}) => ${expected}`, () => {
      expect(divide(a, b)).toBe(expected);
    });
  });

  // 例外をスローするケースのパラメータライズドテスト
  test.each([
    [10, 0],
    [0, 0],
    [-5, 0],
  ])('divide(%i, %i)は例外をスローする', (a, b) => {
    expect(() => divide(a, b)).toThrow('0で割ることはできません');
  });
  
  // 非同期関数のパラメータライズドテスト例
  test.each([
    ['data1', { id: 1, name: 'データ1' }],
    ['data2', { id: 2, name: 'データ2' }],
  ])('fetchData(%s)は%pを返す', async (id, expected) => {
    // モック関数などを使用して非同期処理をテスト
    const mockFetch = jest.fn().mockResolvedValue(expected);
    const result = await mockFetch(id);
    expect(result).toEqual(expected);
  });
});