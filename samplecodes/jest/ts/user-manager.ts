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