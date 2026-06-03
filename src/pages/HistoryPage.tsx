import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '../components/Header';
import { MessageBubble } from '../components/MessageBubble';
import { getSessions, deleteSession } from '../lib/storage';
import type { Session } from '../lib/types';

interface HistoryPageProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function HistoryPage({ isDark, onToggleDark }: HistoryPageProps) {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>(() => getSessions());
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleDeleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('確定要刪除這筆對話紀錄嗎？')) {
      deleteSession(id);
      setSessions(getSessions());
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <Header isDark={isDark} onToggleDark={onToggleDark} />
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                對話紀錄
              </h2>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                僅儲存於此裝置的瀏覽器
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-br from-brand-500 to-brand-600 hover:shadow-brand-500/30 hover:shadow-md transition-all"
            >
              開始新訪談
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in-up">
              <p className="text-gray-500 dark:text-gray-400 mb-4">還沒有訪談紀錄</p>
              <Link
                to="/"
                className="text-sm text-brand-600 hover:text-brand-500 underline underline-offset-2"
              >
                開始第一次訪談
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden"
                >
                  <div
                    onClick={() => navigate(`/?session=${session.id}`)}
                    className="w-full flex items-center justify-between px-4 py-3.5 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left cursor-pointer"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {new Date(session.createdAt).toLocaleDateString('zh-TW', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                        {session.isComplete ? '✓ 訪談完成' : '進行中'} · {session.messages.length} 則訊息
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDeleteSession(e, session.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                        title="刪除紀錄"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
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
                          toggleExpand(session.id);
                        }}
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        title="展開/收合對話內容"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className={`w-4 h-4 transition-transform ${
                            expandedId === session.id ? 'rotate-180' : ''
                          }`}
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {expandedId === session.id && (
                    <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-4 bg-gray-50 dark:bg-gray-950 space-y-4 max-h-96 overflow-y-auto">
                      {session.messages.length === 0 ? (
                        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                          尚無訊息
                        </p>
                      ) : (
                        session.messages.map((msg, idx) => (
                          <MessageBubble key={idx} role={msg.role} content={msg.content} />
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
