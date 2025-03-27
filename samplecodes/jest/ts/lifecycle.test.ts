// lifecycle.test.ts

describe('🌍 グローバルスコープ', () => {
  beforeAll(() => {
    console.log('🌍 beforeAll - グローバル');
  });

  afterAll(() => {
    console.log('🌍 afterAll - グローバル');
  });

  beforeEach(() => {
    console.log('🌍 beforeEach - グローバル');
  });

  afterEach(() => {
    console.log('🌍 afterEach - グローバル');
  });

  test('🌍 テスト1', () => {
    console.log('🌍 テスト本体1');
    expect(true).toBe(true);
  });

  describe('🧪 ネストスコープA', () => {
    beforeAll(() => {
      console.log('🧪 beforeAll - A');
    });

    afterAll(() => {
      console.log('🧪 afterAll - A');
    });

    beforeEach(() => {
      console.log('🧪 beforeEach - A');
    });

    afterEach(() => {
      console.log('🧪 afterEach - A');
    });

    test('🧪 テストA-1', () => {
      console.log('🧪 テスト本体A-1');
      expect(true).toBe(true);
    });

    test('🧪 テストA-2', () => {
      console.log('🧪 テスト本体A-2');
      expect(true).toBe(true);
    });
  });

  describe('📦 ネストスコープB', () => {
    test('📦 テストB-1', () => {
      console.log('📦 テスト本体B-1');
      expect(true).toBe(true);
    });
  });
});