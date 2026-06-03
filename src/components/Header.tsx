import React from 'react';

interface HeaderProps {
  isDark: boolean;
  onToggleDark: () => void;
  onShowHistory?: () => void;
  onNewSession?: () => void;
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

export function Header({ isDark, onToggleDark, onShowHistory, onNewSession }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 flex-shrink-0">
          <div className="w-full h-full" style={logoStyle} />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-tight">sAI'd</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">PM Interview Assistant</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500">
          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          <span>Online</span>
        </div>

        {onNewSession && (
          <button
            onClick={onNewSession}
            className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-500 dark:hover:text-brand-400 transition-colors px-2 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-500/10"
          >
            開啟新對話
          </button>
        )}

        <button
          onClick={onShowHistory}
          className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          查看對話紀錄
        </button>

        <button
          onClick={onToggleDark}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
