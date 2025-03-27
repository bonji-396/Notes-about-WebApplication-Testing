describe('mockFuncのテスト', () => {
  test('呼び出しと戻り値のテスト', () => {
    const mockFunc = jest.fn();

    mockFunc('hello');
    mockFunc.mockReturnValue(42);

    expect(mockFunc).toHaveBeenCalledWith('hello');
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(mockFunc()).toBe(42);
  });
});