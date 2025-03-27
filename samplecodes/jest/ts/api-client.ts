export class ApiClient {
  async fetchData(endpoint: string): Promise<any> {
    // 実際にはHTTPリクエストを行う処理
    const response = await fetch(`https://api.example.com/${endpoint}`);
    return response.json();
  }
}