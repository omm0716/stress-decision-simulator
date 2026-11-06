import React, { useState } from 'react';
import { HeartPulse, AlertTriangle, Copy, Check, Sparkles, HelpCircle } from 'lucide-react';
import type { SimulationResult, MentalRiskLevel } from '../types/simulator';
import { Term } from './Term';

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
          <div>
            <h2 className="text-base font-semibold text-slate-100 m-0">멘탈 마지노선 진단서</h2>
            <p className="text-xs text-slate-400 mt-0.5">내 심리적 체력이 위기를 견딜 수 있는가?</p>
          </div>
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
          <span className="text-xs text-slate-400 font-medium">
            <Term
              name="스트레스 붕괴 지수"
              description="하락장의 깊이, 실직 기간, 지출 누수를 종합해 '당신이 공포를 못 이기고 바닥에서 손절(패닉셀)할 확률'을 0~100점으로 측정한 심리적 지표입니다."
              analogy="지수가 75점 이상이면 하락장에서 밤잠을 설칠 위험이 매우 높음"
            />
          </span>
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
      <div className="grid grid-cols-3 gap-2.5 mb-3 text-center">
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
          <div className="text-[10px] text-slate-400">
            <Term
              name="최대 낙폭 (MDD)"
              title="MDD (최대 낙폭)"
              description="내 계좌가 가장 잘나갈 때 대비 바닥까지 몇 %나 곤두박질치는가를 뜻하는 고통 지수입니다."
              analogy="롤러코스터의 최대 급강하 깊이 (-30% 넘으면 대부분 공황 발생)"
            />
          </div>
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
          <div className="text-[10px] text-slate-400">
            <Term
              name="누적 지출 누수"
              description="배달, OTT, 충동 택시비 등으로 야금야금 사라진 원금의 총합계입니다."
              analogy="주머니에 난 작은 구멍으로 새어나간 동전들의 총합"
            />
          </div>
          <div className="text-sm font-bold font-mono text-sky-400 mt-0.5">
            {totalLeakageAmount.toLocaleString()}만원
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">사라진 원금 합</div>
        </div>
      </div>

      {/* MDD 용어 직접 설명 */}
      <div className="mb-4 bg-slate-950/50 p-2 rounded border border-slate-800/60 text-[11px] text-slate-400 flex items-start gap-1.5">
        <HelpCircle className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
        <span>
          <b>MDD(최대 낙폭)란?</b> 내 계좌가 가장 잘나갈 때 대비 얼마까지 곤두박질치는가를 뜻합니다. 이 수치가 -30%를 넘어가면 십중팔구 공황 상태로 바닥에서 손절하게 됩니다.
        </span>
      </div>

      {/* 실천 행동 처방전 (Actionable Prescription) */}
      <div className="p-3.5 rounded-lg bg-indigo-950/30 border border-indigo-500/30 text-indigo-200">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>오늘부터 실천할 1줄 행동 처방전:</span>
        </div>
        <p className="text-xs leading-relaxed text-indigo-200/90 font-medium">{mentalRisk.prescription}</p>
      </div>
    </div>
  );
};
