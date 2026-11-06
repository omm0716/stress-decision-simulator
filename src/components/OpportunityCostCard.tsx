import React from 'react';
import { Pizza, Plane, Smartphone, Info } from 'lucide-react';
import type { SimulationResult } from '../types/simulator';

interface OpportunityCostCardProps {
  result: SimulationResult;
}

export const OpportunityCostCard: React.FC<OpportunityCostCardProps> = ({ result }) => {
  const { totalLeakageAmount, finalIdeal, finalNormal, totalMonthlyLeak, topCulpritName, topCulpritMonthly } = result;

  // 배달 & 충동 지출로 인해 증발한 복리 기회비용 (만원)
  const opportunityCostLoss = Math.max(0, finalIdeal - finalNormal);

  // 연간 누수액 (만원)
  const annualLeak = Math.round(totalMonthlyLeak * 12);

  const iphoneCount = Math.floor((annualLeak * 10000) / 1600000);
  const flightCount = Math.floor((annualLeak * 10000) / 1000000);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Pizza className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-semibold text-slate-100 m-0">기회비용 & 현실 체감 환산기</h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          월 -{totalMonthlyLeak}만원 누수 기준
        </span>
      </div>

      <div className="space-y-4">
        {/* 누적 기회비용 경고 */}
        <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-500/30">
          <div className="text-xs text-amber-300 font-medium mb-1 flex items-center justify-between">
            <span>💸 OTT·배달·지출 누수로 날아간 미래 복리 자산</span>
            {topCulpritName && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                1위 주범: {topCulpritName} (월 {topCulpritMonthly}만)
              </span>
            )}
          </div>
          <div className="text-xl font-bold font-mono text-amber-400">
            {opportunityCostLoss.toLocaleString()} 만원
            {opportunityCostLoss >= 10000 && ` (${(opportunityCostLoss / 10000).toFixed(1)}억원)`}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            단순히 쓴 돈의 원금 합계({totalLeakageAmount.toLocaleString()}만원)뿐만 아니라, 그 돈이 복리로 불어났을 기회비용까지 포함된 실질 손실입니다.
          </div>
        </div>

        {/* 연간 낭비 체감 비교 */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-300">
            매년 새어 나가는 돈(연 {annualLeak.toLocaleString()}만원)의 현실 무게:
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-sky-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">최신 플래그십 폰</div>
                <div className="font-mono font-bold text-slate-200">연 {iphoneCount}대 분량</div>
              </div>
            </div>
            <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 flex items-center gap-2.5">
              <Plane className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400">동남아/일본 왕복 여행</div>
                <div className="font-mono font-bold text-slate-200">연 {flightCount}회 분량</div>
              </div>
            </div>
          </div>
        </div>

        {/* 1줄 팁 */}
        <div className="flex items-start gap-2 text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded border border-slate-800/60">
          <Info className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
          <span>
            {topCulpritName
              ? `'${topCulpritName}' 항목의 방어율 슬라이더를 15%만 올려보세요. 10년 뒤 자산 그래프가 수천만 원 단위로 올라갑니다.`
              : '자주 이용하지 않는 월정액 구독 항목 체크박스를 끄면 즉시 자산 회복선이 가팔라집니다.'}
          </span>
        </div>
      </div>
    </div>
  );
};
