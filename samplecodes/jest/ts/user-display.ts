import { getUserName } from './user-service';

export function formatUserDisplay(id: number): string {
  const name = getUserName(id);
  return `表示名: ${name}`;
}