it('hoget return', () => {
  const mockFunction = jest.fn();
  mockFunction.mockReturnValue('hoge');
  expect(mockFunction()).toBe('hoge');
  expect(mockFunction()).toBe('hoge');
  expect(mockFunction()).toBe('hoge');
});

it('hoget once return', () => {
  const mockFunction = jest.fn();
  mockFunction.mockReturnValueOnce('pika');
  expect(mockFunction()).toBe('pika');
  expect(mockFunction()).toBe(undefined);
});

it('aync mock', async () => {
  const mockFunction = jest.fn();
  mockFunction.mockResolvedValue('Resolved Value');
  const result = await mockFunction();
  expect(result).toBe('Resolved Value');
});
