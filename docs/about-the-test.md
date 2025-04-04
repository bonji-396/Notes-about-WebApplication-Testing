# テストについて

## テストの重要性
ソフトウェア開発においてテストは以下の理由で非常に重要

1. 品質保証  
バグや不具合を早期に発見し、品質の高いソフトウェアを提供できる。
2. 仕様の確認・ドキュメント代わり  
要件通りに実装されているか確認でき、仕様の意図がコードに明示される（特にユニットテスト）ため、テストコードが仕様書としても機能する。
3. リファクタリング・機能追加時の安全性の確保  
既存の挙動を壊さずに変更を加えることができる。つまり、コード改善時の動作保証ができる。→ 開発者の安心感の確保につながる
4. 開発効率の向上  
不具合の早期発見により、後工程での修正コストを削減できる。→ リリースのスピードを速める

## テストの種類と特徴

|テスト名|レイヤー|主な目的|自動化しやすさ|
|---|---|---|---|
|ユニットテスト|ロジック単位|個々の関数やクラスの正当性|◎|
|インテグレーションテスト|結合|複数モジュール間の連携確認|◯|
|E2Eテスト（End-to-End）|全体システム|実際のユーザ操作の再現|△|
|UIテスト|表示・操作確認|UIの挙動と表示確認|△〜×（ツール依存）|
|回帰テスト|全体または一部|変更で他の部分に影響がないか|◯（自動化次第）|
|受け入れテスト|要件レベル|顧客要求・仕様の満たし確認|△|
|パフォーマンステスト|非機能|応答速度や負荷耐性確認|◯|
|セキュリティテスト|非機能|脆弱性や権限不備の検出|△|
|アクセシビリティテスト|UI・非機能|障害を持つユーザーにも利用可能な設計の確認|△（一部自動化可能）|


## 単体テスト (Unit Test)
最も基本的なテストで、関数やメソッドなどの単位での動作を検証します。
速度が速く、高精度で問題箇所を特定しやすい特徴を持ち、全体の流れや結合部分の問題は検出できない欠点があります。

|||
|---|---|
|対象|関数、メソッド、クラスなどの最小単位|
|特徴|<ul><li>外部依存を切り離して（モック/スタブ利用）テスト</li><li>実行が高速で、CIに最適</li></ul>
|メリット|<ul><li>早期に不具合を発見できる</li><li>コードリファクタリング時に安全性を確保</li></ul>|
|デメリット|<ul><li>モックの作成が面倒な場合もある</li><li>全ての単体が正常でも連携で問題が生じることがある</li><li>実際の動作環境とは異なる</li></ul>|
|適用範囲|<ul><li>ロジックやビジネスルールの検証に最適</li><li>再利用される共通コンポーネント</li></ul>|


### 例: TypeScript/Angularでの実装
```ts
// Jasmine を使用した例
describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should add two numbers correctly', () => {
    expect(service.add(2, 3)).toBe(5);
  });
});
```

## 統合テスト (Integration Test)

複数のユニットが連携して正しく動作するかを検証します。 
セットアップやデータの準備が複雑になることが難点です。

|||
|---|---|
|対象|複数のモジュール・コンポーネント間やAPIの連携部分
|特徴|<ul><li>実際の依存関係を使用（一部モック可）</li><li>外部API、DB、サービスなどとの接続を含める</li></ul>|
|メリット|<ul><li>モジュールやコンポーネント間の連携不整合を発見</li><li>より実際の使用状況に近い環境でテスト</li></ul>|
|デメリット|<ul><li>単体テストよりセットアップや環境構築が複雑になりがち</li><li>実行に時間がかかる</li></ul>|
|適用範囲|<ul><li>マイクロサービス間通信</li><li>複数コンポーネント間の連携</li><li>API連携</li><li>DB連携</li></ul>|


### 例: Angular/TypeScriptでの実装

```ts
// コンポーネントと実際のサービスを組み合わせたテスト
describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let userService: UserService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserComponent],
      providers: [UserService]
    }).compileComponents();
    
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should load users from real service', () => {
    const users = [{id: 1, name: '山田太郎'}];
    spyOn(userService, 'getUsers').and.returnValue(of(users));
    
    component.loadUsers();
    
    expect(component.users).toEqual(users);
  });
});
```

## E2Eテスト (End-to-End Test)）
アプリケーション全体をブラウザで動作させ、ユーザの操作を模倣してシナリオを検証する。実際のユーザーの動線を再現でき、全体の動作を検証できる。実行時間が長く、セットアップも複雑。

|||
|---|---|
|対象|システム全体の動作|
|特徴|ブラウザなどを用いてUIから操作を自動化|
|メリット|ユーザー視点での動作確認ができる|
|デメリット|テストが不安定になりやすく、実行時間が長い|
|適用範囲|ユーザーシナリオの自動テスト（ログイン→投稿→一覧など）|

### 例：　Angularでの実装 (Protractor/Cypress)
```ts
// Cypress を使用した例
describe('ログインフロー', () => {
  it('正しい認証情報でログインできる', () => {
    cy.visit('/login');
    cy.get('#username').type('testuser');
    cy.get('#password').type('password123');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('ようこそ、testuser さん');
  });
});
```

## UIテスト（表示確認・DOM操作）

|||
|---|---|
|対象|画面上の要素とユーザーの操作|
|特徴|スナップショットテストやDOM確認など|
|メリット|見た目の崩れを早期に検知|
|デメリット|レイアウト変更で頻繁に壊れる可能性|
|適用範囲|コンポーネントベースUIの品質確保|


## 回帰テスト（リグレッションテスト）

|||
|---|---|
|対象|変更によって壊れていないことの確認|
|特徴|過去のバグ再発防止|
|メリット|長期的なプロジェクトでの信頼性確保|
|デメリット |テストケースの肥大化、メンテナンスコスト|
|適用範囲|リリース前やCIでの一括チェック|

## UAT (User Acceptance Test)

|||
|---|---|
|対象|ビジネス要件やユーザーストーリー|
|特徴|<ul><li>開発者ではなく、発注者側や利用者が行う</li><li>仕様書やユーザーストーリーを元に、操作を実際に試す</li><li>顧客視点で記述される</li></ul>|
|メリット|<ul><li>要件の満足度を客観的に確認</li><li>	「納品・リリース可否」の最終判断として機能</li></ul>|
|デメリット|<ul><li>テスト計画が曖昧になりがち</li><li>ユーザーが非エンジニアである場合、的確な指摘が出ないこともある</li></ul>|
|適用範囲|<ul><li>システム納品前</li><li>スクラム開発のストーリー終了判定など</li></ul>|


## パフォーマンステスト

|||
|---|---|
|対象|負荷、応答速度、スループットなど|
|特徴|<ul><li>システムの応答性、スケーラビリティを検証</li><li>JMeterやLocustなどのツールで実行</li></ul>|
|メリット|負荷限界の把握とボトルネックの特定し、ユーザー体験の向上|
|デメリット|<ul><li>環境構築が複雑</li><li>実際の本番環境との差異</li><li>解析に専門知識が必要</li></ul>|
|適用範囲|<ul><li>高トラフィックが予想される機能</li><li>バッチ処理、検索処理などデータ処理の多い処理</li><li>レスポンス時間が重要な機能</li></ul>|

##  セキュリティテスト

|||
|---|---|
|対象|<ul><li>脆弱性を検出するためのテスト</li><li>認証、認可、データ保護などを検証</li></ul>|
|特徴|静的解析・動的解析ツールを使用|
|メリット|<ul><li>重大なセキュリティ事故の防止</li><li>コンプライアンス要件の満足</li><li>データー漏洩防止</li></ul>|
|デメリット|<ul><li>知識がないと形骸化しやすい</li><li>継続的な更新が必要</li><ul>|
|適用範囲|<ul><li>認証・認可機能</li><li>API</li><li>データ保存・転送機能</li><li>入力フォーム（XSS、インジェクション攻撃対策）</li><li>管理者画面</li><li>個人情報の取扱部</li></ul>|

## アクセシビリティテスト（Accessibility Test）

|||
|---|---|
|対象|<ul><li>障害を持つユーザーを含む全てのユーザーが利用できるか確認</li><li>WCAG などの基準に準拠しているか検証</li></ul>|
|特徴|<ul><li>スクリーンリーダー対応、キーボード操作、コントラスト比、aria属性の適切な使用などをチェック</li><li>自動ツール（例：axe、Lighthouse）による静的検査＋手動テストの組み合わせが主流</li></ul>|
|メリット|<ul><li>法律・規格（例：WCAG、JIS X 8341-3）への準拠により社会的信頼性が向上</li><li>ユーザー層が広がる（高齢者、障害者対応）</li></ul>|
|デメリット|<ul><li>自動ツールだけでは全項目を網羅できない（実際のユーザー行動による確認が必要）</li><li>設計段階から意識していないと、後からの対応コストが大きい</li></ul>|
|適用範囲|<ul><li>公共機関のサイトやサービス</li><li>BtoCサービス（EC、ポータルなど）や、ユーザー層の多様性が高いプロダクト</li></ul>|

