import React, { useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { StatusBanner } from './StatusBanner';
import type { Message, SaveStatus } from '../lib/types';

interface ChatWindowProps {
  messages: Message[];
  isStreaming: boolean;
  saveStatus: SaveStatus;
}

const logoStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, oklch(0.70 0.17 40), oklch(0.52 0.16 35))',
  WebkitMaskImage: 'url(/logo.png)',
  WebkitMaskSize: 'contain',
  WebkitMaskRepeat: 'no-repeat',
  WebkitMaskPosition: 'center',
  maskImage: 'url(/logo.png)',
  maskSize: 'contain',
  maskRepeat: 'no-repeat',
  maskPosition: 'center',
};

export function ChatWindow({ messages, isStreaming, saveStatus }: ChatWindowProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col bg-white dark:bg-gray-900">
      {saveStatus !== 'idle' && <StatusBanner status={saveStatus} />}

      <div
        ref={scrollAreaRef}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
      >
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[55vh] text-center animate-fade-in-up">
              <div className="w-16 h-16 mb-5">
                <div className="w-full h-full" style={logoStyle} />
              </div>

              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                有什麼我能幫你的嗎？
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                我是您的 PM 訪談助理。請輸入任何訊息開始對話，
                我將協助深入了解您的產品需求與想法。
              </p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <MessageBubble key={idx} role={msg.role} content={msg.content} />
          ))}

          {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
            <div className="flex gap-3 animate-fade-in-up">
              <div className="w-6 h-6 flex-shrink-0 mt-0.5">
                <div className="w-full h-full" style={logoStyle} />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-xs font-medium text-brand-600 mb-2">sAI'd</p>
                <div className="flex items-center gap-1.5">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>
    </div>
  );
}
