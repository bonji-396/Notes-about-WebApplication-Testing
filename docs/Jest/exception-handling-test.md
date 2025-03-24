
# 例外処理のテスト

例外処理のテストの場合は、テストする関数などは、無名関数（アロー関数）でラッピングする必要がある。

## シンプルな例

#### exception-example-simple.ts
```ts
export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('0 で割ることはできません');
  }
  return a / b;
}
```
#### exception-example-simple.test.ts
```ts
import { divide } from './exception-example-simple';

describe('divide 関数', () => {
  test('正常系：10 ÷ 2 = 5', () => {
    expect(divide(10, 2)).toBe(5);
  });

  test('異常系：0 で割ったら例外を投げる', () => {
    expect(() => divide(10, 0)).toThrow(Error);
    expect(() => divide(10, 0)).toThrow('0 で割ることはできません');
  });
});
```
- `toThrow()`: 関数が例外をスローするかを検証
- `toThrow(ErrorType)` : 特定の型の例外がスローされるかを検証

## カスタムエラークラスのテスト例

#### exception-example-validation.ts
```ts
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateUsername(username: string): void {
  if (!username) {
    throw new ValidationError('ユーザー名は必須です');
  }
  
  if (username.length < 3) {
    throw new ValidationError('ユーザー名は3文字以上必要です');
  }
  
  if (username.length > 20) {
    throw new ValidationError('ユーザー名は20文字以下である必要があります');
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new ValidationError('ユーザー名には英数字とアンダースコアのみ使用できます');
  }
}
```
#### exception-example-validation.test.ts
```ts
import { ValidationError, validateUsername } from './exception-example-validation'

 // カスタムエラークラスのテスト
 describe('ユーザー名のバリデーション', () => {
  test('空のユーザー名で例外がスローされる', () => {
    expect(() => validateUsername('')).toThrow(ValidationError);
    expect(() => validateUsername('')).toThrow('ユーザー名は必須です');
  });

  test('短すぎるユーザー名で例外がスローされる', () => {
    expect(() => validateUsername('ab')).toThrow(ValidationError);
    expect(() => validateUsername('ab')).toThrow('ユーザー名は3文字以上必要です');
  });

  test('長すぎるユーザー名で例外がスローされる', () => {
    const longUsername = 'a'.repeat(21);
    expect(() => validateUsername(longUsername)).toThrow(ValidationError);
    expect(() => validateUsername(longUsername)).toThrow('ユーザー名は20文字以下である必要があります');
  });

  test('無効な文字を含むユーザー名で例外がスローされる', () => {
    expect(() => validateUsername('user@name')).toThrow(ValidationError);
    expect(() => validateUsername('user@name')).toThrow('ユーザー名には英数字とアンダースコアのみ使用できます');
  });

  test('有効なユーザー名では例外がスローされない', () => {
    expect(() => validateUsername('valid_user123')).not.toThrow();
  });

  // エラーのインスタンスを詳細に検証
  test('エラーオブジェクトのプロパティを検証', () => {
    try {
      validateUsername('');
      // 例外がスローされなかった場合にテストを失敗させる
      fail('例外がスローされるべきでした');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('ユーザー名は必須です');
    }
  });
 
 });
```

- `toThrow('メッセージ')`: 特定のエラーメッセージを持つ例外がスローされるかを検証
- `not.toThrow()`: 例外がスローされないことを検証
- `toBeInstanceOf()` : オブジェクトが特定のクラスのインスタンスかを検証



## 非同期例外処理のテスト

#### exception-example-asynchronous.ts
```ts
export async function fetchUserData(userId: string): Promise<any> {
  if (!userId) {
    throw new Error('ユーザーIDは必須です');
  }
  
  // 実際のAPI呼び出しをシミュレート
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (userId === 'invalid') {
        reject(new Error('ユーザーが見つかりません'));
      } else {
        resolve({ id: userId, name: 'テストユーザー' });
      }
    }, 100);
  });
}
```

#### exception-example-asynchronous.test.ts
```ts
import { fetchUserData } from './exception-example-asynchronous';

describe('非同期関数の例外テスト', () => {
  // async/await使用
  test('非同期関数の例外をasync/awaitでテスト', async () => {
    await expect(fetchUserData('')).rejects.toThrow('ユーザーIDは必須です');
    await expect(fetchUserData('invalid')).rejects.toThrow('ユーザーが見つかりません');
    
    // 成功ケースもテスト
    const userData = await fetchUserData('123');
    expect(userData).toEqual({ id: '123', name: 'テストユーザー' });
  });

  // Promise使用
  test('非同期関数の例外をPromiseでテスト', () => {
    return expect(fetchUserData('invalid')).rejects.toThrow('ユーザーが見つかりません');
  });
  
  // try-catchブロックを使用した非同期関数のテスト
  test('try-catchブロックを使用した非同期例外テスト', async () => {
    try {
      await fetchUserData('invalid');
      fail('例外がスローされるべきでした');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe('ユーザーが見つかりません');
    }
  });
});
```
- `rejects` : 非同期関数（Promise）が拒否されるかを検証

