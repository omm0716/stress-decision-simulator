import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

export const GuideBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-md mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm md:text-base font-bold text-slate-100 m-0">
              처음이신가요? 이 테스터는 이렇게 사용하세요
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              단순 계산기가 아닌, <span className="text-indigo-300 font-medium">내 재정이 최악의 위기(실직+폭락)를 견딜 수 있는지</span> 점검하는 3단계 가이드
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="text-xs px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-colors flex-shrink-0"
        >
          <span>{isOpen ? '가이드 접기' : '3단계 사용법 보기'}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-4 pt-4 border-t border-indigo-500/20 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-center leading-4 text-[10px]">1</span>
              <span>현실적인 소득과 저축 입력</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              무리한 계획 대신, 현재 시드 머니와 <b>진짜로 매달 남길 수 있는 저축액</b>을 좌측 패널에 입력합니다.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-amber-400 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-amber-500/20 text-center leading-4 text-[10px]">2</span>
              <span>수입 중단 & 누수 지출 주입</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              "이직이나 퇴사로 4개월간 돈이 안 들어오면?", "OTT와 배달비로 새는 돈은?" 등 <b>진짜 현실의 변수</b>를 켭니다.
            </p>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-bold text-rose-400 flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-rose-500/20 text-center leading-4 text-[10px]">3</span>
              <span>최악의 순간(고점 대비 낙폭) 확인</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              우측 차트의 <b>빨간색 '스트레스 곡선'</b>과 <b>'멘탈 진단서'</b>를 보며, 내가 바닥에서 패닉셀하지 않고 버틸 수 있는지 확인합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
