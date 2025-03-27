import { math } from './math';

describe('math オブジェクトのテスト', () => {
  test('特定のメソッドだけをスパイする（モック化）', () => {
    // multiplyメソッドをスパイして実装を置き換える
    const multiplySpy = jest.spyOn(math, 'multiply').mockImplementation((a, b) => a * b * 2);
    
    // addメソッドはそのまま
    expect(math.add(2, 3)).toBe(5);
    
    // multiplyメソッドはモック化されている
    expect(math.multiply(2, 3)).toBe(12); // 通常なら6だが、モックにより12になる
    
    // スパイが呼ばれたことを検証
    expect(multiplySpy).toHaveBeenCalledWith(2, 3);
    
    // テスト後は元に戻す
    multiplySpy.mockRestore();
    expect(math.multiply(2, 3)).toBe(6); // 元に戻っている
  });
  
  test('内部メソッド呼び出しをスパイする', () => {
    // multiplyをスパイするが、実装は変えない
    const multiplySpy = jest.spyOn(math, 'multiply');
    
    // calculateAreaを呼び出す（内部でmultiplyを使用）
    const area = math.calculateArea(2);
    
    // 計算結果を検証
    expect(area).toBeCloseTo(12.57, 2);
    
    // multiplyが内部で2回呼ばれたことを検証
    expect(multiplySpy).toHaveBeenCalledTimes(2);
    expect(multiplySpy).toHaveBeenNthCalledWith(1, 2, 2); // radius * radius
    expect(multiplySpy).toHaveBeenNthCalledWith(2, 4, Math.PI); // (radius * radius) * PI
    
    // 元に戻す
    multiplySpy.mockRestore();
  });
});