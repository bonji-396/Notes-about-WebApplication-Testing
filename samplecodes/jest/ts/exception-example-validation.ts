export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function validateUsername(username: string): void {
  if (!username) {
    throw new ValidationError('ユーザー名は必須です');
  }
  
  if (username.length < 3) {
    throw new ValidationError('ユーザー名は3文字以上必要です');
  }
  
  if (username.length > 20) {
    throw new ValidationError('ユーザー名は20文字以下である必要があります');
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    throw new ValidationError('ユーザー名には英数字とアンダースコアのみ使用できます');
  }
}