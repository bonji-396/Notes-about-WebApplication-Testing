import fs from 'fs';

export const readFile = (path: string) => {
  const data = fs.readFileSync(path, {
    encoding: 'utf-8',
  });
  return data;
};
