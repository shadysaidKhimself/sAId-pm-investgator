import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

interface InputBarProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const hasInput = input.trim().length > 0;

  return (
    <div className="bg-[#FAFAF9] dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 py-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <div className={`flex items-end gap-2 bg-white dark:bg-gray-800 rounded-2xl border shadow-sm transition-all duration-200 px-4 py-3 ${
          disabled
            ? 'border-gray-100 dark:border-gray-700'
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus-within:border-brand-400 focus-within:shadow-md focus-within:shadow-brand-500/10'
        }`}>
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? '正在輸入中...' : "傳送訊息給sAI'd"}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
          />

          <button
            id="send-button"
            onClick={handleSend}
            disabled={disabled || !hasInput}
            className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
              disabled || !hasInput
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-sm hover:shadow-brand-500/30 hover:scale-105 active:scale-95'
            }`}
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-2">
          Enter 送出 · Shift+Enter 換行
        </p>
      </div>
    </div>
  );
}
