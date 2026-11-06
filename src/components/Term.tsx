import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface TermProps {
  name: string; // 표시할 단어 (예: '스트레스 잔고', 'MDD')
  title?: string; // 툴팁 제목 (생략 시 name)
  description: string; // 1줄 쉬운 설명
  analogy?: string; // 직관적인 일상 비유 (선택)
  className?: string;
  badge?: boolean;
}

export const Term: React.FC<TermProps> = ({
  name,
  title,
  description,
  analogy,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // 화면 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center gap-1 cursor-pointer group ${className}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onClick={() => setIsOpen(!isOpen)}
    >
      <span className="border-b border-dotted border-slate-400/80 group-hover:border-indigo-400 group-hover:text-indigo-200 transition-colors">
        {name}
      </span>
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors flex-shrink-0" />

      {/* 팝오버 툴팁 말풍선 */}
      {isOpen && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 md:w-72 p-3 bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 rounded-xl shadow-2xl text-left z-50 pointer-events-auto block animate-in fade-in zoom-in-95 duration-150"
          style={{ filter: 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' }}
        >
          {/* 말풍선 꼬리 */}
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 block w-0 h-0"></span>

          <span className="block font-bold text-xs text-indigo-300 pb-1 mb-1.5 border-b border-slate-800">
            💡 {title || name}이란?
          </span>
          <span className="block text-[11px] text-slate-300 leading-relaxed">
            {description}
          </span>
          {analogy && (
            <span className="block mt-2 p-1.5 rounded bg-indigo-950/50 border border-indigo-500/20 text-[10.5px] text-indigo-200/90 leading-tight">
              🚗 <b>쉽게 비유하면:</b> {analogy}
            </span>
          )}
        </span>
      )}
    </span>
  );
};
