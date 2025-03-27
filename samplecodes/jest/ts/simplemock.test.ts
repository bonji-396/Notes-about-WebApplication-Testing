it('hoge', () => {
  const mockFunction = jest.fn(() => 'Hello Jest');
  expect(mockFunction()).toBe('Hello Jest');
});

it('hoge2', () => {
  const mockFunction = jest.fn();
  mockFunction.mockImplementation(() => 'Hello Jest');
  expect(mockFunction()).toBe('Hello Jest');
});
