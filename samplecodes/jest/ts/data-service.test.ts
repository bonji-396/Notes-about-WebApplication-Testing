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