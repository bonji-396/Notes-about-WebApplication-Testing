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