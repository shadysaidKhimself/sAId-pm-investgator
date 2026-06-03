import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { stripForDisplay } from '../lib/detectEnd';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
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

export function MessageBubble({ role, content }: MessageBubbleProps) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in-up">
        <div className="max-w-[80%] bg-[#F4F4F4] dark:bg-gray-800 rounded-2xl rounded-br-sm px-4 py-3 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
          <p className="whitespace-pre-wrap">{content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-3 animate-fade-in-up">
      <div className="w-6 h-6 flex-shrink-0 mt-0.5">
        <div className="w-full h-full" style={logoStyle} />
      </div>

      <div className="flex-1 min-w-0 text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
        <p className="text-xs font-medium text-brand-600 mb-1">sAI'd</p>
        <div className="markdown-content">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {stripForDisplay(content)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
