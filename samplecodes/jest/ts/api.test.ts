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