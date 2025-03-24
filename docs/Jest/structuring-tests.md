# テストの構造化

describeでのテストのグルーピングは、ネスト構造にすることも可能です。
また、繰り返し行うテストなどでは、以下のようにテスト実行前と実行後の処理を記述することも可能です。

|概要|説明|
|---|---|
|beforeAll / afterAll|各 describe ブロック内で1回だけ実行される|
|beforeEach / afterEach|各テストの前後に毎回実行される|
|ネスト構造|内側の describe の beforeEach は、外側のあとに実行される|
|実行順|外→内、内→外の順に呼ばれる（スタック的な流れ）|



#### lifecycle.test.ts
```ts

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
```
#### 実行結果
```sh
🌍 beforeAll - グローバル

🌍 beforeEach - グローバル
🌍 テスト本体1
🌍 afterEach - グローバル

🧪 beforeAll - A

🌍 beforeEach - グローバル
🧪 beforeEach - A
🧪 テスト本体A-1
🧪 afterEach - A
🌍 afterEach - グローバル

🌍 beforeEach - グローバル
🧪 beforeEach - A
🧪 テスト本体A-2
🧪 afterEach - A
🌍 afterEach - グローバル

🧪 afterAll - A

🌍 beforeEach - グローバル
📦 テスト本体B-1
🌍 afterEach - グローバル

🌍 afterAll - グローバル
```