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