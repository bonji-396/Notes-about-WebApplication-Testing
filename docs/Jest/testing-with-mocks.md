
# モックを使ったテスト

Jestのモック機能は、テスト中に特定のモジュールや関数の動作を制御するための強力なツールです。

## よく使うモック操作

|メソッド|意味|
|---|---|
|`jest.fn()`|モック関数を作成|
|`.mockReturnValue(value)`|常に固定値を返す|
|`.mockImplementation(fn)`|任意のロジックを定義|
|`jest.spyOn(obj, method)`|既存関数をスパイ（＆差し替え可能）|
|`mockFn.mock.calls`|呼び出し履歴の配列|
|`mockFn.mockClear()`|呼び出し履歴をリセット|
|`mockFn.mockRestore()`|元の関数に戻す（spyOn に対してのみ有効）|


## jest.fn()
モック関数の基本的な使い方を以下に記載
#### mock.test.ts
```ts
describe('mockFuncのテスト', () => {
  test('呼び出しと戻り値のテスト', () => {
    const mockFunc = jest.fn();

    mockFunc('hello');
    mockFunc.mockReturnValue(42);

    expect(mockFunc).toHaveBeenCalledWith('hello');
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(mockFunc()).toBe(42);
  });
});
```

### jest.fn()の利用例
#### math.ts
```ts
export const multiply = (a: number, b: number): number => a * b;
```

#### calc.ts
```ts
import { multiply } from './math';

export const square = (x: number): number => {
  return multiply(x, x);
};
```

#### calc.test.ts

実際の`multiply`を使わずに、`multiply`の処理結果を返すモックを作成。

```ts
jest.mock('./math', () => ({
  multiply: jest.fn().mockReturnValue(999)
}));

import { square } from './calc';
import { multiply } from './math';

test('multiply をモックして square をテスト', () => {
  const result = square(5);
  expect(result).toBe(999); // 実際には multiply(5, 5) = 25 のはず

  expect(multiply).toHaveBeenCalledWith(5, 5);
});
```

## `SpyOn`を利用したモック

#### user-service.ts
```ts
export function getUserName(id: number): string {
  // 実際には外部APIやデータベースからユーザー情報を取得するなどの処理
  // 今回は単純な例として
  return `ユーザー${id}`;
}
```
#### user-display.ts
```ts
import { getUserName } from './user-service';

export function formatUserDisplay(id: number): string {
  const name = getUserName(id);
  return `表示名: ${name}`;
}
```

#### user-display.test.ts
```ts
// user-display.test.ts
import { formatUserDisplay } from './user-display';
import * as userService from './user-service';

jest.mock('./user-service');

describe('ユーザー表示機能のテスト', () => {
  test('ユーザー表示名が正しくフォーマットされる', () => {
    // getUserName関数をモック化
    const mockGetUserName = jest.spyOn(userService, 'getUserName');
    mockGetUserName.mockReturnValue('テスト太郎');
    
    // テスト対象の関数を実行
    const result = formatUserDisplay(1);
    
    // 結果を検証
    expect(result).toBe('表示名: テスト太郎');
    
    // モック関数が正しく呼び出されたか検証
    expect(mockGetUserName).toHaveBeenCalledWith(1);
    expect(mockGetUserName).toHaveBeenCalledTimes(1);
  });
});
```

#### 実行結果
```sh
% npm test ./user-display.test.ts

> test
> jest ./user-display.test.ts

 PASS  ./user-display.test.ts
  ユーザー表示機能のテスト
    ✓ ユーザー表示名が正しくフォーマットされる (2 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.991 s
Ran all test suites matching /.\/user-display.test.ts/i.
```


## クラスのモック

#### api-client.ts
```ts
export class ApiClient {
  async fetchData(endpoint: string): Promise<any> {
    // 実際にはHTTPリクエストを行う処理
    const response = await fetch(`https://api.example.com/${endpoint}`);
    return response.json();
  }
}
```

#### data-service.ts
```ts
import { ApiClient } from './api-client';

export class DataService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  async getUserData(userId: string): Promise<any> {
    try {
      const data = await this.apiClient.fetchData(`users/${userId}`);
      return {
        id: data.id,
        name: data.name,
        email: data.email
      };
    } catch (error) {
      throw new Error(`ユーザーデータの取得に失敗しました: ${error.message}`);
    }
  }
}
```

#### data-service.test.ts
```ts
// data-service.test.ts
import { DataService } from './data-service';
import { ApiClient } from './api-client';

jest.mock('./api-client');

describe('データサービスのテスト', () => {
  let dataService: DataService;
  let mockApiClient: jest.Mocked<ApiClient>;
  
  beforeEach(() => {
    // ApiClientのモックインスタンスをクリア
    jest.clearAllMocks();
    
    // ApiClientのモックインスタンスを作成
    mockApiClient = new ApiClient() as jest.Mocked<ApiClient>;
    
    // DataServiceのインスタンスを作成（モックApiClientを注入）
    dataService = new DataService(mockApiClient);
  });
  
  test('正常系: ユーザーデータを取得できる', async () => {
    // モックの戻り値を設定
    mockApiClient.fetchData = jest.fn().mockResolvedValue({
      id: 'user123',
      name: 'テスト太郎',
      email: 'test@example.com',
      age: 30 // 余分なデータ
    });
    
    // テスト対象メソッドを実行
    const userData = await dataService.getUserData('user123');
    
    // 結果を検証
    expect(userData).toEqual({
      id: 'user123',
      name: 'テスト太郎',
      email: 'test@example.com'
    });
    
    // モックメソッドが正しく呼び出されたか検証
    expect(mockApiClient.fetchData).toHaveBeenCalledWith('users/user123');
    expect(mockApiClient.fetchData).toHaveBeenCalledTimes(1);
  });
  
  test('異常系: APIエラー時に例外がスローされる', async () => {
    // エラーを返すモックを設定
    mockApiClient.fetchData = jest.fn().mockRejectedValue(new Error('Network error'));
    
    // 例外がスローされることを検証
    await expect(dataService.getUserData('user123')).rejects.toThrow(
      'ユーザーデータの取得に失敗しました: Network error'
    );
    
    expect(mockApiClient.fetchData).toHaveBeenCalledWith('users/user123');
  });
});
```

#### 実行結果
```sh
 % npm test data-service.test.ts 

> test
> jest data-service.test.ts

 PASS  ./data-service.test.ts
  データサービスのテスト
    ✓ 正常系: ユーザーデータを取得できる (2 ms)
    ✓ 異常系: APIエラー時に例外がスローされる (2 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.111 s
Ran all test suites matching /data-service.test.ts/i.
```