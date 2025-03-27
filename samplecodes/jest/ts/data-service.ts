import { ApiClient } from './api-client';

export class DataService {
  private apiClient: ApiClient;
  
  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }
  
  async getUserData(userId: string): Promise<any> {
    try {
      const data = await this.apiClient.fetchData(`users/${userId}`);
      return {
        id: data.id,
        name: data.name,
        email: data.email
      };
    } catch (error) {
      throw new Error(`ユーザーデータの取得に失敗しました: ${error.message}`);
    }
  }
}