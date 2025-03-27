// exception-examples.test.ts
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