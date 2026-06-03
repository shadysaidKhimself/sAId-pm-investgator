import { useState, useCallback, useRef, useEffect } from 'react';
import type { Session, Message, SaveStatus, ChecklistItem } from '../lib/types';
import { detectInterviewEnd, extractChecklistUpdates } from '../lib/detectEnd';
import { getSessions, getSession, saveSession, createSession } from '../lib/storage';

const CHECKLIST_LABELS = [
  '開場與建立信任',
  '商業模式確認',
  '現有流程 As-Is',
  '使用者角色',
  '角色行為與權限',
  '理想流程 To-Be',
  '決策目標與 BDD 場景',
];

function buildChecklist(completed: number[]): ChecklistItem[] {
  const completedSet = new Set(completed);
  let activeAssigned = false;
  return CHECKLIST_LABELS.map((label, i) => {
    const id = i + 1;
    if (completedSet.has(id)) return { id, label, status: 'done' as const };
    if (!activeAssigned) {
      activeAssigned = true;
      return { id, label, status: 'active' as const };
    }
    return { id, label, status: 'todo' as const };
  });
}

function initSession(id?: string | null): Session {
  if (id) {
    const s = getSession(id);
    if (s) return s;
  }
  const sessions = getSessions();
  const incomplete = sessions.find((s) => !s.isComplete);
  if (incomplete) return incomplete;
  const fresh = createSession();
  saveSession(fresh);
  return fresh;
}

export function useChat(initialSessionId?: string | null) {
  const [session, setSession] = useState<Session>(() => initSession(initialSessionId));

  useEffect(() => {
    if (initialSessionId && initialSessionId !== session.id) {
      const s = getSession(initialSessionId);
      if (s) {
        setSession(s);
      }
    }
  }, [initialSessionId]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [checklistProgress, setChecklistProgress] = useState<number[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  const checklist = buildChecklist(checklistProgress);
  const messages = session.messages;

  const saveDoc = useCallback(async (internalDoc: string, sessionId: string) => {
    setSaveStatus('saving');
    try {
      const date = new Date().toISOString().split('T')[0];
      const res = await fetch('/api/save-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: internalDoc, sessionId, date }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaveStatus('success');
    } catch {
      setSaveStatus('error');
    }
  }, []);

  const sendMessage = useCallback(
    async (userInput: string) => {
      if (!userInput.trim() || isStreaming) return;

      const userMsg: Message = {
        role: 'user',
        content: userInput.trim(),
        createdAt: new Date().toISOString(),
      };

      const sessionWithUser: Session = {
        ...session,
        messages: [...session.messages, userMsg],
      };
      setSession(sessionWithUser);
      saveSession(sessionWithUser);
      setIsStreaming(true);

      const abortController = new AbortController();
      abortRef.current = abortController;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: sessionWithUser.messages }),
          signal: abortController.signal,
        });

        if (!res.ok) {
          const body = await res.text().catch(() => '(no body)');
          throw new Error(`API error: ${res.status} — ${body}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let fullText = '';
        const assistantCreatedAt = new Date().toISOString();

        // Add placeholder assistant message
        setSession({
          ...sessionWithUser,
          messages: [
            ...sessionWithUser.messages,
            { role: 'assistant', content: '', createdAt: assistantCreatedAt },
          ],
        });

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          for (const line of decoder.decode(value, { stream: true }).split('\n')) {
            if (!line.startsWith('data: ')) continue;
            const data = line.slice(6).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                const streaming: Session = {
                  ...sessionWithUser,
                  messages: [
                    ...sessionWithUser.messages,
                    { role: 'assistant', content: fullText, createdAt: assistantCreatedAt },
                  ],
                };
                setSession(streaming);
                saveSession(streaming);
              }
            } catch {
              // skip malformed JSON
            }
          }
        }

        // Update checklist
        const newItems = extractChecklistUpdates(fullText);
        if (newItems.length > 0) {
          setChecklistProgress((prev) => [...new Set([...prev, ...newItems])]);
        }

        // Detect interview end and strip internal tokens
        const { isComplete, internalDoc, cleanText } = detectInterviewEnd(fullText);

        const finalSession: Session = {
          ...sessionWithUser,
          isComplete,
          messages: [
            ...sessionWithUser.messages,
            { role: 'assistant', content: cleanText, createdAt: assistantCreatedAt },
          ],
        };
        setSession(finalSession);
        saveSession(finalSession);

        if (isComplete && internalDoc) {
          await saveDoc(internalDoc, sessionWithUser.id);
        }
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Chat error:', error);
        setSession((prev) => {
          const msgs = [...prev.messages];
          const last = msgs[msgs.length - 1];
          if (last?.role === 'assistant' && !last.content) {
            msgs[msgs.length - 1] = { ...last, content: '抱歉，發生了錯誤。請稍後再試。' };
          }
          return { ...prev, messages: msgs };
        });
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [session, isStreaming, saveDoc]
  );

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const startNewSession = useCallback(() => {
    const fresh = createSession();
    saveSession(fresh);
    setSession(fresh);
  }, []);

  return { session, messages, isStreaming, saveStatus, checklist, sendMessage, stopStreaming, startNewSession };
}
