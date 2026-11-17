import { INITIAL_USERS } from '@/content/permissions';
import type { UserService } from './contracts';
export function createMockUserService(): UserService {
  let users = structuredClone(INITIAL_USERS);
  return {
    getUsers: () => structuredClone(users),
    replaceUsers(next) { users = structuredClone(next); },
    updateUser(user) { users = users.map(current => current.id === user.id ? structuredClone(user) : current); },
  };
}