import fs from 'fs';
import { readFile } from './module-mock';
import exp from 'constants';

jest.mock('fs');
const mockFs = jest.mocked(fs);
mockFs.readFileSync.mockReturnValue('dummy');

test('readFileでダミーデータが返却される', () => {
  const result = readFile('path/dummy');
  expect(result).toBe('dummy');
  expect(fs.readFileSync).toHaveBeenCalledWith('path/dummy', {
    encoding: 'utf-8',
  });
  expect(fs.readFileSync).toHaveBeenCalledTimes(1);
});
