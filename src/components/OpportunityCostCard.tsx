import React from 'react';
import { Scale, Compass, Watch, Info, Car, Home } from 'lucide-react';
import type { SimulationResult } from '../types/simulator';
import { Term } from './Term';

interface OpportunityCostCardProps {
  result: SimulationResult;
}

export const OpportunityCostCard: React.FC<OpportunityCostCardProps> = ({ result }) => {
  const {
    totalLeakageAmount,
    finalIdeal,
    finalNormal,
    totalMonthlyLeak,
    topCulpritName,
    topCulpritMonthly,
    carImpactSummary,
    homeImpactSummary,
  } = result;

  const opportunityCostLoss = Math.max(0, finalIdeal - finalNormal);
  const annualLeak = Math.round(totalMonthlyLeak * 12);

  const iphoneCount = Math.floor((annualLeak * 10000) / 1600000);
  const flightCount = Math.floor((annualLeak * 10000) / 1000000);

  return (
    <div className="steam-panel p-5">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#5c4524]">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-[#f0cf85]" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#c99738] block">
              AUDIT NO. III — OPPORTUNITY COST &amp; HEAVY BILLS
            </span>
            <h2 className="text-base font-bold text-[#f7e7ce] m-0">기회비용 &amp; 대형 부채 감정서</h2>
          </div>
        </div>
        <span className="text-xs text-[#bfa988] font-mono px-2 py-0.5 rounded bg-[#140f0c] border border-[#4d3a1f]">
          월 -{totalMonthlyLeak}만원 누출 기준
        </span>
      </div>

      <div className="space-y-4">
        {/* 누적 기회비용 경고 */}
        <div className="p-3.5 rounded bg-[#261b10] border border-[#8c6a32]">
          <div className="text-xs text-[#f0cf85] font-medium mb-1 flex items-center justify-between flex-wrap gap-1">
            <span className="flex items-center gap-1">
              ⚙{' '}
              <Term
                name="증발한 미래 복리 기회비용"
                title="기회비용 (Opportunity Cost)"
                description="단순히 내가 쓴 원금뿐 아니라, 그 돈을 쓰지 않고 10년간 복리(연 8%)로 굴렸다면 벌 수 있었던 미래의 진짜 손실 금액입니다."
                analogy="지금 태워버린 석탄 한 줌이 10년 뒤 열차 한 대를 움직일 증기 동력이 될 기회를 날린 것"
              />
            </span>
            {topCulpritName && (
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#3b1814] text-[#ff9e8a] border border-[#8f3d2f] font-mono">
                최대 누수 파이프: {topCulpritName} (월 {topCulpritMonthly}만)
              </span>
            )}
          </div>
          <div className="text-xl font-bold font-mono text-[#f7dfa5]">
            {opportunityCostLoss.toLocaleString()} 만원
            {opportunityCostLoss >= 10000 && ` (${(opportunityCostLoss / 10000).toFixed(1)}억원)`}
          </div>
          <div className="text-[11px] text-[#bfa988] mt-1">
            단순히 쓴 돈의 원금 합계({totalLeakageAmount.toLocaleString()}만원)뿐만 아니라, 그 자본이 복리 기관에서 불어났을 동력까지 합산된 실질 손실입니다.
          </div>
        </div>

        {/* 대형 지름 (차량 & 주담대) 임팩트 분석 */}
        {(carImpactSummary || homeImpactSummary) && (
          <div className="pt-2 border-t border-[#5c4524] space-y-2">
            <div className="text-xs font-bold text-[#ff9e8a]">🚂 대형 중장비·저택이 남긴 현실 청구서:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
              {carImpactSummary && (
                <div className="p-3 rounded bg-[#2b1d12] border border-[#8c6a32]">
                  <div className="flex items-center gap-1.5 text-[#f0cf85] font-bold mb-1.5">
                    <Car className="w-3.5 h-3.5" /> 차량 총 지출 &amp; 감가상각
                  </div>
                  <div className="text-[#d8c7ad] text-[11px] space-y-1">
                    <div>• 총 지출액(할부+유지비): <b className="text-[#f7e7ce] font-mono">{carImpactSummary.totalPaidForCar.toLocaleString()}만원</b></div>
                    <div>• 감가상각 부식 손실: <b className="text-[#e05a47] font-mono">-{carImpactSummary.depreciationLoss.toLocaleString()}만원</b></div>
                    <div>• 최종 잔존 기계가치: <b className="text-[#bfa988] font-mono">{carImpactSummary.finalCarValue.toLocaleString()}만원</b></div>
                  </div>
                </div>
              )}

              {homeImpactSummary && (
                <div className="p-3 rounded bg-[#182621] border border-[#456e5d]">
                  <div className="flex items-center gap-1.5 text-[#7ec8a3] font-bold mb-1.5">
                    <Home className="w-3.5 h-3.5" /> 주택담보대출 이자 청구서
                  </div>
                  <div className="text-[#d8c7ad] text-[11px] space-y-1">
                    <div>• 매달 징수되는 원리금: <b className="text-[#f7e7ce] font-mono">월 {homeImpactSummary.monthlyMortgage.toLocaleString()}만원</b></div>
                    <div>• 은행에 바친 총 이자: <b className="text-[#e05a47] font-mono">약 {homeImpactSummary.totalInterestPaid.toLocaleString()}만원</b></div>
                    <div>• 최종 부동산 평가액: <b className="text-[#7ec8a3] font-mono">{(homeImpactSummary.finalHomeValue / 10000).toFixed(1)}억원</b></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 연간 낭비 체감 비교 */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-[#d8c7ad]">
            매년 허공으로 새어 나가는 돈(연 {annualLeak.toLocaleString()}만원)의 현실 무게:
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="bg-[#140f0c] p-2.5 rounded border border-[#4d3a1f] flex items-center gap-2.5">
              <Watch className="w-4 h-4 text-[#f0cf85] flex-shrink-0" />
              <div>
                <div className="text-[10px] text-[#bfa988]">최신 정밀 통신기(스마트폰)</div>
                <div className="font-mono font-bold text-[#f7e7ce]">연 {iphoneCount}대 분량</div>
              </div>
            </div>
            <div className="bg-[#140f0c] p-2.5 rounded border border-[#4d3a1f] flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-[#7ec8a3] flex-shrink-0" />
              <div>
                <div className="text-[10px] text-[#bfa988]">해외 증기선 유람(여행)</div>
                <div className="font-mono font-bold text-[#f7e7ce]">연 {flightCount}회 분량</div>
              </div>
            </div>
          </div>
        </div>

        {/* 1줄 팁 */}
        <div className="parchment-note p-2.5 text-[11px] flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-[#f0cf85] mt-0.5 flex-shrink-0" />
          <span>
            {topCulpritName
              ? `'${topCulpritName}' 밸브의 방어율 레버를 15%만 잠가보세요. 10년 뒤 자본 궤적이 수천만 원 단위로 상승합니다.`
              : '자주 쓰지 않는 정기 구독 밸브를 잠그면 즉시 보일러 압력 회복선이 가팔라집니다.'}
          </span>
        </div>
      </div>
    </div>
  );
};
