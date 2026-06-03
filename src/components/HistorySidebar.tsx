import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSessions, deleteSession } from '../lib/storage';
import { MessageBubble } from './MessageBubble';
import type { Session } from '../lib/types';

interface HistorySidebarProps {
  onClose: () => void;
}

export function HistorySidebar({ onClose }: HistorySidebarProps) {
  const [, setSearchParams] = useSearchParams();
  const [sessions, setSessions] = useState<Session[]>(() => getSessions());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('確定要刪除這筆對話紀錄嗎？')) {
      deleteSession(id);
      setSessions(getSessions());
    }
  };

  const toggle = (id: string) => setExpandedId((prev) => (prev === id ? null : id));

  return (
    <aside className="flex flex-col w-72 xl:w-80 border-r border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 shrink-0 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          對話紀錄
        </span>
        <button
          onClick={onClose}
          className="w-6 h-6 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          aria-label="關閉紀錄"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {sessions.length === 0 ? (
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center py-10">
            還沒有訪談紀錄
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="rounded-xl border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              <div
                onClick={() => {
                  setSearchParams({ session: session.id });
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 dark:text-gray-200 truncate">
                    {new Date(session.createdAt).toLocaleDateString('zh-TW', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                    {session.isComplete ? '✓ 完成' : '進行中'} · {session.messages.length} 則
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleDeleteSession(e, session.id)}
                    className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded transition-colors"
                    title="刪除紀錄"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" x2="10" y1="11" y2="17" />
                      <line x1="14" x2="14" y1="11" y2="17" />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggle(session.id);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
                    title="展開/收合對話內容"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`w-3.5 h-3.5 transition-transform ${
                        expandedId === session.id ? 'rotate-180' : ''
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
              </div>

              {expandedId === session.id && (
                <div className="border-t border-gray-100 dark:border-gray-800 px-3 py-3 bg-white dark:bg-gray-950 space-y-3 max-h-72 overflow-y-auto">
                  {session.messages.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">尚無訊息</p>
                  ) : (
                    session.messages.map((msg, idx) => (
                      <MessageBubble key={idx} role={msg.role} content={msg.content} />
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
