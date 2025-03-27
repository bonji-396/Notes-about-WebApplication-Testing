jest.mock('./math', () => ({
  multiply: jest.fn().mockReturnValue(999)
}));

import { square } from './calc';
import { multiply } from './math';

test('multiply をモックして square をテスト', () => {
  const result = square(5);
  expect(result).toBe(999); // 実際には multiply(5, 5) = 25 のはず

  expect(multiply).toHaveBeenCalledWith(5, 5);
});