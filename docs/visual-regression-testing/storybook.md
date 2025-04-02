# Storybook

Storybookは、UIコンポーネントの開発とドキュメント作成のためのオープンソースツールです。

## Storybookとは
Storybookは、UIコンポーネントを独立した環境で開発・テスト・ドキュメント化するためのツールです。
アプリケーションの全体的な依存関係や状態に影響されずに、UIコンポーネントを個別に確認・テストできます。  
React, Vue, Angular, SvelteなどのコンポーネントベースのUIフレームワークをサポートしています。

## Storybook にできること

|機能|説明|
|---|---|
|UIコンポーネントのカタログ化|全てのコンポーネントを一覧化し、インタラクティブに確認可能|
|開発とデバッグ|個々のコンポーネントをisolatedな環境で開発・検証|
|ビジュアルリグレッションテスト|StorybookのアドオンでUIの変化を視覚的に検出|
|ドキュメント自動生成|コンポーネントの使用例やAPIを自動でドキュメント化|
|アドオン拡張|アクセシビリティチェック、レスポンシブモード、Knobsなど多様な機能を追加可能|


## Story

「1つのコンポーネントの特定の状態を記述するファイル」です。  
例えば、ボタンコンポーネントのバリエーションを以下のように記述します。

#### Button.stories.ts
```ts
import { Button } from './Button';

export default {
  title: 'Components/Button',
  component: Button,
};

export const Primary = () => <Button type="primary">Primary Button</Button>;
export const Disabled = () => <Button disabled>Disabled Button</Button>;
```



## セットアップ（Reactの場合）

```sh
npx storybook init
npm run storybook
```

これで .storybook ディレクトリが作られ、localhost:6006 でStorybookのUIが立ち上がります。

## 利用シーン
- UIコンポーネントの設計・試作
- チーム内・外とのUI共有
- デザイナーとの連携（Figmaとの統合も可能）
- 開発途中のプロトタイピング
- コンポーネント単位のテスト（JestやTesting Libraryと連携）


## 主なアドオン例

|アドオン|内容|
|---|---|
|@storybook/addon-essentials|よく使うアドオン集（Docs, Controls, Actionsなど）|
|@storybook/addon-a11y|アクセシビリティチェック|
|storybook-addon-designs|Figmaなどデザインとの連携|
|storybook/testing-library|UIテストとの統合支援|

