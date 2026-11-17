/** Compatibility facade for existing sign-in screens and application guards. */
import { authService } from './services/authService';
export { SESSION_KEY } from './services/authService';

export function hasSession() {
  return authService.getCurrentUser() !== null;
}

export function startDemoSession(email: string, remember: boolean) {
  return authService.login(email, remember);
}

export function endDemoSession() {
  authService.logout();
}
