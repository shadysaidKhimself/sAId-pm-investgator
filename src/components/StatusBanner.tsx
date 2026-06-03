import { useEffect, useState } from 'react';

interface StatusBannerProps {
  status: 'streaming' | 'saving' | 'success' | 'error';
}

export function StatusBanner({ status }: StatusBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (status === 'success') {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => setIsVisible(false), 350);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (!isVisible) return null;

  const config = {
    streaming: {
      bg: 'from-blue-50 to-indigo-50 border-blue-200',
      icon: (
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      ),
      text: 'sAI\'d 正在整理需求，請稍候...',
      textColor: 'text-blue-800',
    },
    saving: {
      bg: 'from-amber-50 to-orange-50 border-amber-200',
      icon: (
        <div className="flex items-center gap-1">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
        </div>
      ),
      text: '正在儲存訪談記錄...',
      textColor: 'text-amber-800',
    },
    success: {
      bg: 'from-emerald-50 to-green-50 border-emerald-200',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-emerald-600"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      ),
      text: '文件已儲存完成，PM 將盡快與您聯繫。',
      textColor: 'text-emerald-800',
    },
    error: {
      bg: 'from-amber-50 to-yellow-50 border-amber-200',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-amber-600"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ),
      text: '文件儲存中，PM 將盡快與您聯繫。',
      textColor: 'text-amber-800',
    },
  };

  const { bg, icon, text, textColor } = config[status];

  return (
    <div
      className={`${
        isExiting ? 'animate-slide-up-out' : 'animate-slide-down'
      }`}
    >
      <div
        className={`mx-4 mt-3 px-4 py-3 rounded-xl bg-gradient-to-r ${bg} border flex items-center gap-3 shadow-sm`}
      >
        <div className="flex-shrink-0">{icon}</div>
        <p className={`text-sm font-medium ${textColor}`}>{text}</p>
      </div>
    </div>
  );
}
