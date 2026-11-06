import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export const GuideBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="steam-panel p-4 mb-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded brass-plaque flex-shrink-0">
            <BookOpen className="w-5 h-5 text-[#f0cf85]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#c99738]">
                OPERATOR&apos;S MANUAL NO. 1
              </span>
            </div>
            <h2 className="text-sm md:text-base font-bold text-[#f7e7ce] m-0">
              처음이신가요? 증기 압력 시험기 작동 3단계 교범
            </h2>
            <p className="text-xs text-[#bfa988] mt-0.5">
              단순 복리 계산기가 아닌, <span className="text-[#f0cf85] font-semibold">내 자산 보일러가 최악의 고압(실직·폭락·대형지출)에서 폭발하지 않는지</span> 실험하는 장치입니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs px-3 py-1.5 rounded brass-plaque hover:brightness-110 flex items-center gap-1.5 transition-all flex-shrink-0 cursor-pointer"
        >
          <span>{isOpen ? '교범 접기' : '3단계 작동법 열람'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-[#5c4524] grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="parchment-note p-3 space-y-1">
            <div className="font-bold text-[#f0cf85] flex items-center gap-1.5 font-mono">
              <span>[STEP I]</span>
              <span className="font-sans">기본 석탄 화력(소득·저축) 투입</span>
            </div>
            <p className="text-[#d8c7ad] leading-relaxed text-[11px]">
              무리한 장밋빛 계획 대신, 현재 보유한 종잣돈과 <b>매달 실제로 보일러에 넣을 수 있는 저축액</b>을 좌측 레버로 설정합니다.
            </p>
          </div>

          <div className="parchment-note p-3 space-y-1">
            <div className="font-bold text-[#e59849] flex items-center gap-1.5 font-mono">
              <span>[STEP II]</span>
              <span className="font-sans">증기 누출 &amp; 연료 중단 위기 주입</span>
            </div>
            <p className="text-[#d8c7ad] leading-relaxed text-[11px]">
              "이직·실직으로 연료 공급이 끊기면?", "구독료·배달비·자동차·주택 대출로 증기가 새어나가면?" 등 <b>현실의 압력 변수</b>를 켭니다.
            </p>
          </div>

          <div className="parchment-note p-3 space-y-1">
            <div className="font-bold text-[#e05a47] flex items-center gap-1.5 font-mono">
              <span>[STEP III]</span>
              <span className="font-sans">보일러 한계 압력(MDD) 및 원장 검열</span>
            </div>
            <p className="text-[#d8c7ad] leading-relaxed text-[11px]">
              우측 계기판의 <b>붉은색 '스트레스 궤적'</b>과 <b>'멘탈 압력 게이지'</b>를 통해, 바닥에서 패닉셀(폭발)하지 않고 완주할 수 있는지 판별합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
