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