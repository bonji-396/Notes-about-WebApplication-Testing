# ビジュアルリグレッションテスト（Visual Regression Testing）
ビジュアルリグレッションテストは、UIの視覚的な変更を自動的に検出するテスト手法です。
コードの変更によって意図しないUI変更が発生していないかを確認するのに役立ちます。

## テストフロー
1. スクリーンショットを取得（初回時 → ゴールデン画像）
2. 変更後に再度スクリーンショットを取得
3. ピクセル単位で差分比較
4. 差異がある場合 → テスト失敗として報告

## 検出対象

|状況|検出されるか|
|---|---|
|フォントサイズの変化|検出される|
|マージンのずれ|検出される|
|色の変更|検出される|
|HTML構造の差異|検出されない（DOMではなく見た目ベース）|


## 主なツール

|ツール名|特徴|
|---|---|
|Loki|Storybook に特化。React/Vue/Angular 対応|
|Chromatic|Storybook + CI 向け。SaaS型。高精度差分|
|Percy|CI/CD 向けのSaaS型。GitHub連携に強い|
|Playwright + @playwright/test|E2E と一体化してスクリーンショット差分テスト可|
|[Cypress + Percy]|統合も可能（Cypress単体では画像差分機能なし）|



## 例：Storybook + Loki を使った構成（Angularでも可）

```sh
npm install --save-dev @storybook/angular loki
npx loki init
```

#### テスト実行
```sh
npx loki test
```
loki/ ディレクトリに差分画像と比較結果が出力されます。

⸻

## Playwright を使った例（Vite/Angular対応）
```sh
npm install --save-dev @playwright/test
npx playwright install
```
#### テストコード例（visual.spec.ts）
```ts
import { test, expect } from '@playwright/test';

test('visual regression of homepage', async ({ page }) => {
  await page.goto('http://localhost:4200');
  expect(await page.screenshot()).toMatchSnapshot('homepage.png');
});
```

## CIとの連携
- GitHub Actions や GitLab CI で、スクリーンショットの差分を自動検出
- 差分があれば PR にコメントで通知したり、ビルドを失敗させることが可能

## メリット
- 手動で UI を確認しなくても崩れを自動検出
- 変更による 意図しない副作用を防止

## 注意点
- False Positive（偽陽性） が起きやすい（フォントのアンチエイリアスなど）
- 実行環境依存が大きい（OS、解像度、ブラウザ）
