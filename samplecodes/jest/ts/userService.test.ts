import * as logger from './logger';
import { createUser } from './userService';

describe('createUser', () => {
  test('logが呼ばれていることを確認', () => {
    const mockLog = jest.spyOn(logger, 'log').mockImplementation(() => {});

    const result = createUser('Taro');

    expect(result).toBe('user-Taro');
    expect(mockLog).toHaveBeenCalledWith('ユーザー作成: Taro');

    mockLog.mockRestore(); // 元に戻す（重要）
  });
});