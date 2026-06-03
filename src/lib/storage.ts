import type { Session } from './types';

const STORAGE_KEY = 'pm_sessions';

export function getSessions(): Session[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: Session): void {
  try {
    const sessions = getSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.unshift(session);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch {
    // quota exceeded or private browsing — fail silently
  }
}

export function getSession(id: string): Session | null {
  return getSessions().find((s) => s.id === id) ?? null;
}

export function createSession(): Session {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    isComplete: false,
    messages: [],
  };
}

export function deleteSession(id: string): void {
  try {
    const sessions = getSessions();
    const updated = sessions.filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}
