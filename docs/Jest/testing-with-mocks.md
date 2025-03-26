# モックを使ったテスト
Jestを使ったモックテストの実例を通して、関数・モジュール・クラス・内部メソッドなど、様々なレベルでのモックの使い方を、具体的なコードとともに、実際にどう動作するかを以下に記述します。

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
`jest.fn()` を使って、呼び出し履歴の検証や任意の戻り値を返すモック関数を作成する方法を紹介します。

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
他モジュールの関数（この例では multiply）を `jest.mock()` でモックし、実装に依存せずにテストする方法を示しています。

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
`jest.spyOn()` を使って、既存の関数を一時的にモック化し、呼び出し検証や戻り値の制御を行う方法を示しています。
### 基本的使い方
#### spyOn.ts
```ts
export class Calculator {
  sum(a: number, b: number): number {
    return a + b;
  }
}
```
#### 
```ts
import { Calculator } from './spyon-mock';

test('sumメソッドをSpyOnする', () => {
  const calc = new Calculator();
  // spyの設定
  const sumSpy = jest.spyOn(calc, 'sum');
  const result = calc.sum(1, 2);
  expect(result).toBe(3);
  expect(sumSpy).toHaveBeenCalledWith(1, 2);
  expect(sumSpy).toHaveBeenCalledTimes(1);

  expect(calc.sum(1, 2)).toBe(33);

  // spyの解除
  sumSpy.mockRestore();
});
```

### 実践例
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
クラスをモック化して、依存関係のあるコンポーネントをテスト対象から切り離す方法を紹介します。

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
    
    // モックメソッドが正しく呼ばれたか検証
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

## モジュール全体のモック
モジュール全体（設定値やログ出力など）をモックし、外部依存を排除してテストの再現性を高める方法を解説しています。

### 基本例
#### module-mock.ts
```ts
import fs from 'fs';

export const readFile = (path: string) => {
  const data = fs.readFileSync(path, {
    encoding: 'utf-8',
  });
  return data;
};
```

#### module-mock.test.ts
```ts
import fs from 'fs';
import { readFile } from './module-mock';
import exp from 'constants';

jest.mock('fs');
const mockFs = jest.mocked(fs);
mockFs.readFileSync.mockReturnValue('dummy');

test('readFileでダミーデータが返却される', () => {
  const result = readFile('path/dummy');
  expect(result).toBe('dummy');
  expect(fs.readFileSync).toHaveBeenCalledWith('path/dummy', {
    encoding: 'utf-8',
  });
  expect(fs.readFileSync).toHaveBeenCalledTimes(1);
});

```

### 実践例
#### config.ts
```ts
export const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retryCount: 3
};
```

#### logger2.ts
```ts
export function log(message: string, level: 'info' | 'warn' | 'error' = 'info'): void {
  console.log(`[${level.toUpperCase()}] ${message}`);
}
```

#### api.ts
```ts
import { config } from './config';
import { log } from './logger2';

export async function fetchUserProfile(userId: string): Promise<any> {
  log(`ユーザープロファイル取得開始: ${userId}`, 'info');
  
  try {
    // AbortSignal.timeout()を使用
    const signal = AbortSignal.timeout(config.timeout);
    
    const response = await fetch(`${config.apiUrl}/users/${userId}`, {
      signal,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`APIエラー: ${response.status}`);
    }
    
    const data = await response.json();
    log(`ユーザープロファイル取得成功: ${userId}`, 'info');
    return data;
  } catch (error) {
    log(`ユーザープロファイル取得失敗: ${error.message}`, 'error');
    throw error;
  }
}
```

#### api.test.ts
```ts
import { fetchUserProfile } from './api';
import { config } from './config';
import { log } from './logger2';

// モジュール全体をモック
jest.mock('./config', () => ({
  config: {
    apiUrl: 'https://mock-api.example.com',
    timeout: 1000,
    retryCount: 0
  }
}));

jest.mock('./logger2');

// fetchのグローバルモック
global.fetch = jest.fn();

describe('API関数のテスト', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('ユーザープロファイルを正常に取得できる', async () => {
    // fetchのモック実装 - TypeScriptエラーを回避
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        id: 'user123',
        name: '山田太郎',
        email: 'yamada@example.com'
      })
    });
    
    // テスト対象関数を実行
    const profile = await fetchUserProfile('user123');
    
    // 結果を検証
    expect(profile).toEqual({
      id: 'user123',
      name: '山田太郎',
      email: 'yamada@example.com'
    });
    
    // fetchが正しいURLで呼ばれたか検証
    expect(mockFetch).toHaveBeenCalledWith(
      'https://mock-api.example.com/users/user123',
      expect.objectContaining({
        signal: expect.any(Object),
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
    );
    
    // loggerが正しく呼ばれたか検証
    expect(log).toHaveBeenCalledWith('ユーザープロファイル取得開始: user123', 'info');
    expect(log).toHaveBeenCalledWith('ユーザープロファイル取得成功: user123', 'info');
  });
  
  test('APIエラー時に例外がスローされる', async () => {
    // エラーを返すfetchモック
    const mockFetch = global.fetch as jest.Mock;
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404
    });
    
    // 例外がスローされることを検証
    await expect(fetchUserProfile('user999')).rejects.toThrow('APIエラー: 404');
    
    // エラーログが記録されたか検証
    expect(log).toHaveBeenCalledWith('ユーザープロファイル取得開始: user999', 'info');
    expect(log).toHaveBeenCalledWith('ユーザープロファイル取得失敗: APIエラー: 404', 'error');
  });
});
```

#### 実行結果
```sh
% npm test api.test.ts

> test
> jest api.test.ts

 PASS  ts/api.test.ts
  API関数のテスト
    ✓ ユーザープロファイルを正常に取得できる (3 ms)
    ✓ APIエラー時に例外がスローされる (3 ms)

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        0.685 s, estimated 1 s
Ran all test suites matching /api.test.ts/i.
```

## モック関数の高度な使い方
モック関数の呼び出し状況や戻り値を詳細に検証し、コールバックや内部データ処理のテストに活用する方法を紹介します。

#### user-manager.ts
```ts
export interface User {
  id: string;
  name: string;
  age: number;
  isActive: boolean;
}

export class UserManager {
  async getUsers(): Promise<User[]> {
    // 実際にはAPIからデータを取得する処理
    return [];
  }
  
  async processUsers(callback: (user: User) => boolean): Promise<number> {
    const users = await this.getUsers();
    let processedCount = 0;
    
    for (const user of users) {
      if (callback(user)) {
        processedCount++;
      }
    }
    
    return processedCount;
  }
  
  async getActiveAdults(): Promise<User[]> {
    const users = await this.getUsers();
    return users.filter(user => user.isActive && user.age >= 20);
  }
}
```

#### user-manager.test.ts
```ts
import { UserManager, User } from './user-manager';

describe('UserManagerのテスト', () => {
  let userManager: UserManager;
  const mockUsers: User[] = [
    { id: '1', name: '田中', age: 25, isActive: true },
    { id: '2', name: '鈴木', age: 17, isActive: true },
    { id: '3', name: '佐藤', age: 42, isActive: false },
    { id: '4', name: '山田', age: 30, isActive: true }
  ];
  
  beforeEach(() => {
    userManager = new UserManager();
    
    // getUsers メソッドをモック化
    userManager.getUsers = jest.fn().mockResolvedValue(mockUsers);
  });
  
  test('コールバック関数の動作を検証する', async () => {
    // モックコールバック関数
    const mockCallback = jest.fn(user => user.age >= 20);
    
    // テスト対象メソッドを実行
    const count = await userManager.processUsers(mockCallback);
    
    // 結果を検証
    expect(count).toBe(3); // 20歳以上は3人
    
    // コールバックが正しく呼ばれたか検証
    expect(mockCallback).toHaveBeenCalledTimes(4);
    
    // 各呼び出しの引数を検証
    expect(mockCallback).toHaveBeenNthCalledWith(1, mockUsers[0]);
    expect(mockCallback).toHaveBeenNthCalledWith(2, mockUsers[1]);
    expect(mockCallback).toHaveBeenNthCalledWith(3, mockUsers[2]);
    expect(mockCallback).toHaveBeenNthCalledWith(4, mockUsers[3]);
    
    // 結果の検証 - mockCallbackの結果を取得
    const callResults = mockCallback.mock.results.map(result => result.value);
    expect(callResults).toEqual([true, false, true, true]);
  });
  
  test('getActiveAdults メソッドのテスト', async () => {
    // テスト対象メソッドを実行
    const activeAdults = await userManager.getActiveAdults();
    
    // 結果を検証
    expect(activeAdults).toHaveLength(2);
    expect(activeAdults).toContainEqual(mockUsers[0]); // 田中: 25歳, アクティブ
    expect(activeAdults).toContainEqual(mockUsers[3]); // 山田: 30歳, アクティブ
    
    // getUsersが呼ばれたことを検証
    expect(userManager.getUsers).toHaveBeenCalledTimes(1);
  });
  
  // 特定の実装を一時的に上書きするテスト
  test('特定のテストだけ異なるモック実装を使用', async () => {
    // このテストだけ違うデータをモック
    (userManager.getUsers as jest.Mock).mockResolvedValueOnce([
      { id: '5', name: '伊藤', age: 22, isActive: true },
      { id: '6', name: '渡辺', age: 35, isActive: false }
    ]);
    
    const activeAdults = await userManager.getActiveAdults();
    
    expect(activeAdults).toHaveLength(1);
    expect(activeAdults[0].name).toBe('伊藤');
  });
});
```

#### 実行結果
```sh
% npm test user-manager.test.ts

> test
> jest user-manager.test.ts

 PASS  ts/user-manager.test.ts
  UserManagerのテスト
    ✓ コールバック関数の動作を検証する (3 ms)
    ✓ getActiveAdults メソッドのテスト (1 ms)
    ✓ 特定のテストだけ異なるモック実装を使用

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        1.025 s
Ran all test suites matching /user-manager.test.ts/i.
```

## 部分的なモック (spyOn)
`spyOn` を使って、オブジェクトの一部のメソッドだけをモック化する方法や、内部関数の呼び出し検証を行うテストパターンを説明します。

#### math.ts
```ts
export const math = {
  add(a: number, b: number): number {
    return a + b;
  },
  
  subtract(a: number, b: number): number {
    return a - b;
  },
  
  multiply(a: number, b: number): number {
    return a * b;
  },
  
  divide(a: number, b: number): number {
    if (b === 0) throw new Error('0で割ることはできません');
    return a / b;
  },
  
  calculateArea(radius: number): number {
    return this.multiply(this.multiply(radius, radius), Math.PI);
  }
};
```

#### math.test.ts
```ts
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
```

#### 実行結果
```sh
% npm test math.test.ts        

> test
> jest math.test.ts

 PASS  ts/math.test.ts
  math オブジェクトのテスト
    ✓ 特定のメソッドだけをスパイする（モック化） (2 ms)
    ✓ 内部メソッド呼び出しをスパイする

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        1.007 s
Ran all test suites matching /math.test.ts/i.
```