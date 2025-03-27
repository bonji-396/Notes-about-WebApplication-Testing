
## Jestインストール

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
