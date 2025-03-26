# Jest

Meta社が開発して、JavaScript、TypeScriptのテストフレームワーク

Babel、Node、React、Angular、Vue など、基本的にJavaScriptやTypeScriptで書かれたコードであれば、様々なフレームワークで利用することが可能です。


日本語でのドキュメントも充実しており、まずはこちらの[公式ドキュメント](https://jestjs.io/ja/docs/getting-started)を参照すると良いでしょう。

## Jestの特徴

- 設定不要ですぐ使える（ゼロコンフィグ）
- オールインワン
   - テストランナー
   - アサーション機能
   - モック機能
   - カバレッジレポート
- モック機能が充実
- スナップショット
   - 大きなオブジェクトの状態を簡単に保存・比較できる
   - UIコンポーネントの変更を追跡
- 並列実行
   - 複数のテストを並列実行して高速化が図れる

## 基本的使い方

### インストール

```sh
npm install --save-dev jest
# TypeScriptで利用する場合
npm install --save-dev @types/jest ts-jest
```

### 設定ファイルの作成

```json
npx ts-jest config:init
```

#### jest.config.js
```js
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
};
```

#### tsconfig.json

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

そのままだと、以下のような警告が発生するので、コンパイラーオプションを上記のように指定する。
```sh
ts-jest[config] (WARN) message TS151001:
If you have issues related to imports, you should consider setting `esModuleInterop` to `true`
```


### 基本的なテストの書き方

#### calculator.ts
```ts
export const add = (a: number, b: number): number => a + b;
```

#### calculator.test.ts
```ts
import { add } from './calculator';

describe('add関数', () => {
  test('2 + 3 = 5になること', () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### テスト実施
#### テスト実行
```sh
npx jest # 全体テスト実行
```

#### テスト結果
```sh
% npx jest
 PASS  ./calculator.test.ts
  add関数
    ✓ 2 + 3 = 5になること (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.664 s, estimated 1 s
Ran all test suites.
```

### npmからのテスト実行
#### package.json
```json
{
  "scripts": {
    "test": "jest"
  }
}
```

#### テスト実行
```bsh
npm test
```

#### テスト結果
```sh
% npm test

> test
> jest

 PASS  ./calculator.test.ts
  add関数
    ✓ 2 + 3 = 5になること (1 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.666 s, estimated 1 s
Ran all test suites.
```

## マッチャー（Matchers）
Jestには様々な比較用マッチャーが用意されています。  
以下はよく使うマッチャーの一覧です。

|マッチャー|説明|
|---|---|
|`toBe(value)`|値が一致するか（===）|
|`toEqual(obj)`|オブジェクトや配列の構造が等しいか|
|`toBeTruthy() / toBeFalsy()`|真偽値判定|
|`toContain(item)`|配列や文字列に含まれているか|
|`toThrow()`|エラーが投げられるか|

```ts
expect(value).toBe(exactValue);     // 厳密等価（===）
expect(value).toEqual(object);      // 深い等価比較
expect(value).toBeNull();           // nullかどうか
expect(value).toBeDefined();        // undefinedでないか
expect(value).toBeTruthy();         // 真値か
expect(value).toContain('文字列');   // 含まれているか
expect(func).toThrow();             // 例外を投げるか
```
