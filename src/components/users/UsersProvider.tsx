import { useContext, useState, type ReactNode } from 'react';
import { INITIAL_AUDIT, type DirectoryUser } from '@/content/permissions';
import { createMockUserService } from '@/lib/services/userService';
import { userChanges } from '@/content/users';
import { UsersContext } from './users-context';

// Future authenticated membership service replaces this session-only state.
// Organisation invitations, password resets and billing checks require server validation.
export function UsersProvider({ children }: { children: ReactNode }) {
  const [service] = useState(createMockUserService);
  const [users, setUsersState] = useState(()=>service.getUsers());
  const setUsers: React.Dispatch<React.SetStateAction<DirectoryUser[]>> = next => setUsersState(current => {
    const updated = typeof next === 'function' ? next(current) : next;
    service.replaceUsers(updated);
    return updated;
  });
  const [audit, setAudit] = useState(INITIAL_AUDIT);
  function saveUser(user: DirectoryUser) {
    const before = users.find(u => u.id === user.id);
    if (!before) return;
    setAudit(current => [...userChanges(before, user), ...current]);
    setUsers(current => current.map(u => u.id === user.id ? user : u));
  }
  return <UsersContext.Provider value={{ users, setUsers, audit, setAudit, saveUser }}>{children}</UsersContext.Provider>;
}
export function useUsers() {
  const value = useContext(UsersContext);
  if (!value) throw new Error('UsersProvider missing');
  return value;
}