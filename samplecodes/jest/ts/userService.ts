import { log } from './logger';

export const createUser = (name: string): string => {
  log(`ユーザー作成: ${name}`);
  return `user-${name}`;
};