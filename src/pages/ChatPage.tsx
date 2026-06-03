import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { ChatWindow } from '../components/ChatWindow';
import { InputBar } from '../components/InputBar';
import { ChecklistSidebar } from '../components/ChecklistSidebar';
import { HistorySidebar } from '../components/HistorySidebar';
import { useChat } from '../hooks/useChat';

interface ChatPageProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function ChatPage({ isDark, onToggleDark }: ChatPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  
  const { messages, isStreaming, saveStatus, checklist, sendMessage, startNewSession } = useChat(sessionId);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      <Header
        isDark={isDark}
        onToggleDark={onToggleDark}
        onShowHistory={() => setShowHistory(true)}
        onNewSession={() => {
          setSearchParams({});
          startNewSession();
        }}
      />
      <div className="flex flex-1 overflow-hidden">
        {showHistory ? (
          <HistorySidebar onClose={() => setShowHistory(false)} />
        ) : (
          <ChecklistSidebar items={checklist} />
        )}
        <div className="flex flex-col flex-1 overflow-hidden">
          <ChatWindow
            messages={messages}
            isStreaming={isStreaming}
            saveStatus={saveStatus}
          />
          <InputBar onSend={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}
