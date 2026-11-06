import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

interface TermProps {
  name: string;
  title?: string;
  description: string;
  analogy?: string;
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
      <span className="border-b border-dotted border-amber-500/70 group-hover:border-amber-300 group-hover:text-amber-200 transition-colors">
        {name}
      </span>
      <HelpCircle className="w-3.5 h-3.5 text-amber-500/80 group-hover:text-amber-300 transition-colors flex-shrink-0" />

      {isOpen && (
        <span
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 md:w-72 p-3 bg-[#1d1610] border-2 border-[#9e7836] rounded shadow-2xl text-left z-50 pointer-events-auto block"
          style={{
            boxShadow: '0 12px 28px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(240, 207, 133, 0.2)',
          }}
        >
          <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#9e7836] block w-0 h-0"></span>

          <span className="block font-bold text-xs text-[#f0cf85] pb-1 mb-1.5 border-b border-[#5c4524]">
            ⚙ [용어 주석] {title || name}
          </span>
          <span className="block text-[11px] text-[#e6d7be] leading-relaxed font-normal">
            {description}
          </span>
          {analogy && (
            <span className="block mt-2 p-2 rounded bg-[#2b2016] border border-[#6b5129] text-[10.5px] text-[#f3d999] leading-tight font-normal">
              🚂 <b>19세기 비유:</b> {analogy}
            </span>
          )}
        </span>
      )}
    </span>
  );
};
