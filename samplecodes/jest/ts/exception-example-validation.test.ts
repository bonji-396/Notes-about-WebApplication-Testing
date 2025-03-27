import { ValidationError, validateUsername } from './exception-example-validation'

 // カスタムエラークラスのテスト
 describe('ユーザー名のバリデーション', () => {
  test('空のユーザー名で例外がスローされる', () => {
    expect(() => validateUsername('')).toThrow(ValidationError);
    expect(() => validateUsername('')).toThrow('ユーザー名は必須です');
  });

  test('短すぎるユーザー名で例外がスローされる', () => {
    expect(() => validateUsername('ab')).toThrow(ValidationError);
    expect(() => validateUsername('ab')).toThrow('ユーザー名は3文字以上必要です');
  });

  test('長すぎるユーザー名で例外がスローされる', () => {
    const longUsername = 'a'.repeat(21);
    expect(() => validateUsername(longUsername)).toThrow(ValidationError);
    expect(() => validateUsername(longUsername)).toThrow('ユーザー名は20文字以下である必要があります');
  });

  test('無効な文字を含むユーザー名で例外がスローされる', () => {
    expect(() => validateUsername('user@name')).toThrow(ValidationError);
    expect(() => validateUsername('user@name')).toThrow('ユーザー名には英数字とアンダースコアのみ使用できます');
  });

  test('有効なユーザー名では例外がスローされない', () => {
    expect(() => validateUsername('valid_user123')).not.toThrow();
  });

  // エラーのインスタンスを詳細に検証
  test('エラーオブジェクトのプロパティを検証', () => {
    try {
      validateUsername('');
      // 例外がスローされなかった場合にテストを失敗させる
      fail('例外がスローされるべきでした');
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.name).toBe('ValidationError');
      expect(error.message).toBe('ユーザー名は必須です');
    }
  });
 
 });

