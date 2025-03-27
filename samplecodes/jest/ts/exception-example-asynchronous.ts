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