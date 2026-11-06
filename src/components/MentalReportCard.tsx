import React, { useState } from 'react';
import { HeartPulse, AlertTriangle, Copy, Check, Sparkles } from 'lucide-react';
import type { SimulationResult, MentalRiskLevel } from '../types/simulator';

interface MentalReportCardProps {
  result: SimulationResult;
}

const getBadgeStyles = (level: MentalRiskLevel) => {
  switch (level) {
    case 'SAFE':
      return {
        bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        bar: 'bg-emerald-500',
        text: 'text-emerald-400',
      };
    case 'CAUTION':
      return {
        bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        bar: 'bg-amber-500',
        text: 'text-amber-400',
      };
    case 'PANIC':
      return {
        bg: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
        bar: 'bg-orange-500',
        text: 'text-orange-400',
      };
    case 'MELTDOWN':
      return {
        bg: 'bg-rose-500/20 border-rose-500/50 text-rose-400 animate-pulse',
        bar: 'bg-rose-500',
        text: 'text-rose-400',
      };
  }
};

export const MentalReportCard: React.FC<MentalReportCardProps> = ({ result }) => {
  const { mentalRisk, maxDrawdownRate, maxDrawdownAmount, worstYear, totalLeakageAmount } = result;
  const [copied, setCopied] = useState(false);
  const styles = getBadgeStyles(mentalRisk.level);

  const handleCopy = () => {
    const text = `[의사결정 스트레스 테스트 진단 결과]
• 멘탈 위험 등급: ${mentalRisk.title} (${mentalRisk.score}점)
• 최대 충격 낙폭: -${maxDrawdownRate}% (고점 대비 -${maxDrawdownAmount.toLocaleString()}만원 증발)
• 취약 시점: ${worstYear}년차
• 누적 지출 누수: ${totalLeakageAmount.toLocaleString()}만원
• 처방전: ${mentalRisk.prescription}

👉 의사결정 스트레스 테스터로 점검 완료`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg relative overflow-hidden">
      {/* 백그라운드 그라디언트 악센트 */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-400" />
          <h2 className="text-base font-semibold text-slate-100 m-0">멘탈 마지노선 진단서</h2>
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? '복사 완료!' : '결과 복사'}
        </button>
      </div>

      {/* 멘탈 위험 점수 게이지 바 */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-400 font-medium">스트레스 붕괴 지수</span>
          <span className={`text-sm font-bold font-mono ${styles.text}`}>
            {mentalRisk.score} / 100점
          </span>
        </div>
        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${styles.bar}`}
            style={{ width: `${Math.max(5, mentalRisk.score)}%` }}
          ></div>
        </div>
      </div>

      {/* 진단 타이틀 뱃지 & 설명 */}
      <div className={`p-4 rounded-lg border mb-4 ${styles.bg}`}>
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <div className="font-bold text-sm tracking-tight">{mentalRisk.title}</div>
        </div>
        <p className="text-xs leading-relaxed opacity-90">{mentalRisk.description}</p>
      </div>

      {/* 핵심 스트레스 지표 3종 */}
      <div className="grid grid-cols-3 gap-2.5 mb-4 text-center">
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400">최대 고통 낙폭 (MDD)</div>
          <div className="text-sm font-bold font-mono text-rose-400 mt-0.5">-{maxDrawdownRate}%</div>
          <div className="text-[10px] text-slate-500 font-mono mt-0.5">
            (-{maxDrawdownAmount.toLocaleString()}만원)
          </div>
        </div>
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400">최악의 고비 시점</div>
          <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">{worstYear}년차</div>
          <div className="text-[10px] text-slate-500 mt-0.5">손절 유혹 최대</div>
        </div>
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400">누적 지출 누수</div>
          <div className="text-sm font-bold font-mono text-sky-400 mt-0.5">
            {totalLeakageAmount.toLocaleString()}만원
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">배달+돌발 지출</div>
        </div>
      </div>

      {/* 실천 행동 처방전 (Actionable Prescription) */}
      <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-indigo-200">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>의사결정 행동 처방전:</span>
        </div>
        <p className="text-xs leading-relaxed text-indigo-200/90">{mentalRisk.prescription}</p>
      </div>
    </div>
  );
};
